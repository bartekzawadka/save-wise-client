import React, {Component} from 'react';
import {TextField, withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import FormControl from "@material-ui/core/FormControl/FormControl";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import CurrencyField from "../budgets/new/components/CurrencyField";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import ExpenseService from "../../services/ExpenseService";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ConfirmationDialog from "../../common/dialogs/ConfirmationDialog";
import AutoComplete from "../../common/AutoComplete";
import ContentWrapper from "../../common/ContentWrapper";

const styles = theme => ({
    AddEditExpenseRoot: {
        maxWidth: '600px',
        marginTop: 20,
        marginRight: 'auto',
        marginBottom: 20,
        marginLeft: 'auto',
    },
    AddEditExpenseDatePicker: {
        margin: theme.spacing.unit,
        width: '100%'
    },
    AddEditExpenseError: {
        color: "#ff3d00"
    },
    AddEditExpenseFormContainer: {
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap'
    },
    AddEditExpenseFormControl: {
        margin: theme.spacing.unit,
        flex: '1 auto'
    },
    AddEditExpenseSaveButton: {
        marginLeft: 'auto'
    },
    AddEditExpenseActions: {
        display: 'flex'
    },
    AddEditExpenseIconButton: {
        height: 48,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    AddEditExpenseDeleteButton: {
        color: '#ff3d00'
    }
});


class AddEditExpense extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            types: [],
            date: {
                value: new Date().yyyymmdd(),
                isInvalid: false,
                defaultErrorMessage: 'Data wydatku jest wymagana',
                errorMessage: ''
            },
            category: {
                value: '',
                isInvalid: true,
                defaultErrorMessage: 'Nie wybrano kategorii wydatku',
                errorMessage: 'Nie wybrano kategorii wydatku'
            },
            type: {
                value: '',
                isInvalid: true,
                defaultErrorMessage: 'Nie wybrano typu kategorii',
                errorMessage: 'Nie wybrano typu kategorii'
            },
            comment: {
                value: ''
            },
            amount: {
                value: 0.0,
                isInvalid: true,
                defaultErrorMessage: 'Kwota wydatku jest nieprawidłowa',
                errorMessage: 'Kwota wydatku jest nieprawidłowa'
            },
            isFormInvalid: false,
            expenseId: (this.props.match.params && this.props.match.params.expenseId)
                ? this.props.match.params.expenseId
                : '',
            expenseDeleteDialogOpen: false
        };

        this.expenseService = new ExpenseService();
    }

    componentDidMount() {
        this.getData();
    }

    getExpenseObjectState = (defaultValue, defaultErrorMessage, isValidFunction, getValueFunction) => {
        return {
            value: isValidFunction() ? getValueFunction() : defaultValue,
            isInvalid: !isValidFunction(),
            defaultErrorMessage: defaultErrorMessage,
            errorMessage: isValidFunction() ? '' : defaultErrorMessage
        };
    };

    getFormInvalid = (values) => {
        let result = true;
        for (let k in values) {
            if (values.hasOwnProperty(k) && values[k].isInvalid === true) {
                result = false;
                break;
            }
        }
        return result;
    };

    getData = () => {
        return this.expenseService.getExpenseCategories().then(data => {
            let state = this.state;
            state.categories = data.data;
            state.types = AddEditExpense.getTypes(this.state);

            this.setState(state);

            if (this.props.match.params.planId && this.props.match.params.expenseId) {
                this.expenseService.getExpense(this.props.match.params.planId, this.props.match.params.expenseId)
                    .then(data => {
                        if (data && data.data) {
                            this.setExpense(data.data);
                            this.setState({
                                types: AddEditExpense.getTypes(this.state)
                            });
                        }
                    });
            }
        });
    };

    setExpense = (data) => {

        let date = this.getExpenseObjectState(new Date().yyyymmdd(),
            'Data wydatku jest wymagana',
            () => {
                return true;
            },
            () => new Date(data.date).yyyymmdd());
        let category = this.getExpenseObjectState('',
            'Nie wybrano kategorii wydatku',
            () => {
                return !!(data.category);
            },
            () => data.category);
        let type = this.getExpenseObjectState('',
            'Nie wybrano typu kategorii',
            () => {
                return !!(data.type)
            },
            () => data.type);
        let amount = this.getExpenseObjectState(0.0,
            'Kwota wydatku jest nieprawidłowa',
            () => {
                return !!(data.amount && data.amount > 0.0);
            },
            () => data.amount);

        this.setState({
            date: date,
            category: category,
            type: type,
            amount: amount,
            isFormInvalid: this.getFormInvalid([category.value, type.value, amount.value]),
            comment: {
                value: (data.comment) ? data.comment : ''
            },
        });
    };

    onCategoryChange = value => {
        this.onValueChange('category', value);
    };

    onTypeChange = value => {
        this.onValueChange('type', value);
    };

    onCommentChange = event => {
        this.onValueChange('comment', event.target.value);
    };

    onDateChange = event => {
        this.onValueChange('date', event.target.value);
    };

    onValueChange = (property, value) => {
        let state = this.state;
        state[property].value = value;
        if (state[property].value) {
            state[property].isInvalid = false;
            state[property].errorMessage = '';
        } else {
            state[property].isInvalid = true;
            state[property].errorMessage = state[property].defaultErrorMessage;
        }

        if (property === 'category') {
            state['type'].value = '';
            state.types = AddEditExpense.getTypes(state);
        }

        this.setState(state);
        this.validateForm();
    };

    getTitle = () => {
        if (this.state.expenseId) {
            return "Edycja wydatku";
        }
        return "Dodaj wydatek";
    };

    static getTypes(state) {
        let types = [];
        if (state.category.value) {
            for (let k in state.categories) {
                if (state.categories.hasOwnProperty(k)) {
                    if (state.categories[k].name !== state.category.value) {
                        continue;
                    }

                    if (state.categories[k].types && state.categories[k].types.length > 0) {
                        types = state.categories[k].types.map(item => {
                            return item.name;
                        });
                    }
                }
            }
        }

        return types;
    }

    onAmountChange = event => {
        let state = this.state;

        try {
            state.amount.value = parseFloat(event.target.value);
            if (state.amount.value > 0.0) {
                state.amount.isInvalid = false;
                state.amount.errorMessage = '';
            } else {
                state.amount.isInvalid = true;
                state.amount.errorMessage = state.amount.defaultErrorMessage;
            }
        } catch {
            state.amount.isInvalid = true;
            state.amount.errorMessage = state.amount.defaultErrorMessage;
        }

        this.setState(state);
        this.validateForm();
    };

    validateForm = () => {
        let state = this.state;
        state.isFormInvalid = state.date.isInvalid
            || state.category.isInvalid
            || state.type.isInvalid
            || state.amount.isInvalid;

        this.setState(state);
    };

    submit = () => {
        let data = {
            date: this.state.date.value,
            category: this.state.category.value,
            type: this.state.type.value,
            comment: this.state.comment.value,
            amount: this.state.amount.value,
            id: this.state.expenseId
        };

        this.expenseService.upsertExpense(this.props.match.params.planId, data, this.state.expenseId)
            .then(() => {
                this.props.history.goBack();
            })
            .catch(e => {
                console.log(e);
            })
    };

    onCancel = () => {
        this.props.history.goBack();
    };

    handleDeleteDialogOpen = () => {
        this.setState({
            expenseDeleteDialogOpen: true
        });
    };

    handleDeleteDialogClose = (result) => {
        this.setState({
            expenseDeleteDialogOpen: false
        });

        if (result) {
            this.expenseService.deleteExpense(this.props.match.params.planId, this.props.match.params.expenseId)
                .then(() => {
                    this.props.history.goBack();
                }).catch(e => {
                console.log(e);
            })
        }
    };

    render() {
        const {classes} = this.props;

        return <ContentWrapper>
            <div className={classes.AddEditExpenseRoot}>
                <Card>
                    <CardHeader title={this.getTitle()} action={
                        (this.state.expenseId) ?
                            <Button variant="text"
                                    className={classes.AddEditExpenseDeleteButton}
                                    onClick={this.handleDeleteDialogOpen}>
                                <DeleteForeverIcon/>
                                Usuń
                            </Button>
                            : ''
                    }>
                    </CardHeader>
                    <CardContent>
                        <div className={classes.AddEditExpenseFormContainer} align="center">
                            <TextField
                                label="Data wydatku"
                                type='date'
                                required
                                error={this.state.date.isInvalid}
                                helperText={this.state.date.errorMessage}
                                value={this.state.date.value}
                                onChange={this.onDateChange}
                                className={classes.AddEditExpenseDatePicker}
                                InputLabelProps={{
                                    shrink: true
                                }}/>
                        </div>
                        <div className={classes.AddEditExpenseFormContainer} align="center">
                            <FormControl className={classes.AddEditExpenseFormControl}>
                                <AutoComplete value={this.state.category.value}
                                              required
                                              onChange={this.onCategoryChange}
                                              error={this.state.category.isInvalid}
                                              suggestions={this.state.categories.map(item => item.name)}
                                              label='Kategoria'
                                />
                                <FormHelperText className={classes.AddEditExpenseError}>
                                    {this.state.category.errorMessage}
                                </FormHelperText>
                            </FormControl>
                        </div>
                        <div className={classes.AddEditExpenseFormContainer} align="center">
                            <FormControl className={classes.AddEditExpenseFormControl}>
                                <AutoComplete value={this.state.type.value}
                                              required
                                              onChange={this.onTypeChange}
                                              error={this.state.type.isInvalid}
                                              suggestions={this.state.types}
                                              label='Podkategoria'
                                />
                                <FormHelperText className={classes.AddEditExpenseError}>
                                    {this.state.type.errorMessage}
                                </FormHelperText>
                            </FormControl>
                        </div>
                        <div className={classes.AddEditExpenseFormContainer} align="center">
                            <FormControl className={classes.AddEditExpenseFormControl}>
                                <TextField value={this.state.amount.value}
                                           required
                                           error={this.state.amount.isInvalid}
                                           helperText={this.state.amount.errorMessage}
                                           onChange={this.onAmountChange}
                                           label="Kwota" InputProps={{
                                    inputComponent: CurrencyField,
                                    endAdornment: <InputAdornment position="end">zł</InputAdornment>
                                }}
                                />
                            </FormControl>
                        </div>
                        <div className={classes.AddEditExpenseFormContainer} align="center">
                            <FormControl className={classes.AddEditExpenseFormControl}>
                                <TextField value={this.state.comment.value}
                                           onChange={this.onCommentChange}
                                           label="Komentarz" rows={6} multiline/>
                            </FormControl>
                        </div>
                    </CardContent>
                    <CardActions className={classes.AddEditExpenseActions} disableActionSpacing>
                        <Button variant="outlined" color="default" onClick={this.onCancel}>
                            <CloseIcon/>
                            Anuluj
                        </Button>
                        <Button variant="outlined"
                                color="primary"
                                disabled={this.state.isFormInvalid}
                                className={classes.AddEditExpenseSaveButton}
                                onClick={this.submit}>
                            <SaveIcon/>
                            Zapisz
                        </Button>
                    </CardActions>
                </Card>
                <ConfirmationDialog message="Czy na pewno chcesz usunąć wydatek? Ta operacja jest nieodwracalna!"
                                    title="Czy chcesz kontynuować?"
                                    open={this.state.expenseDeleteDialogOpen}
                                    onClose={this.handleDeleteDialogClose}/>
            </div>
        </ContentWrapper>
    }
}

AddEditExpense.propTypes = {
    expense: PropTypes.object,
    planId: PropTypes.string
};

export default withStyles(styles)(AddEditExpense);
