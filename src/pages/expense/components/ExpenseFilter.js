import React, {Component} from 'react';
import {TextField, withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import AutoComplete from "../../../common/AutoComplete";

const styles = (theme) => ({
    ExpenseFilterHeading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    ExpenseFilterContainer: {
        margin: '0 auto'
    },
    ExpenseFilterFilterField: {
        margin: theme.spacing.unit,
        width: 200,
    },
});

class ExpenseFilter extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.filter ? this.props.filter : {
            dateFrom: undefined,
            dateTo: undefined,
            category: ''
        };
    }

    componentDidMount() {
        this.onSearch()
    }

    onValueChange = (property) => event => {
        let state = this.state;
        state[property] = event.target.value;
        this.setState(state);
    };

    onCategoryChange = value => {
        this.setState({
            category: value
        });
    };

    onSearch = () => {
        this.props.onSearch(this.state);
    };

    render() {
        const {classes} = this.props;

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography className={classes.ExpenseFilterHeading}>Filtry</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.ExpenseFilterContainer}>
                        <div>
                            <TextField className={classes.ExpenseFilterFilterField}
                                       label="Data od:"
                                       type="date"
                                       onChange={this.onValueChange('dateFrom')}
                                       value={this.state.dateFrom}
                                       InputLabelProps={{
                                           shrink: true
                                       }}
                            />
                            <TextField className={classes.ExpenseFilterFilterField}
                                       label="Data do:"
                                       type="date"
                                       onChange={this.onValueChange('dateTo')}
                                       value={this.state.dateTo}
                                       InputLabelProps={{
                                           shrink: true
                                       }}
                            />
                            <AutoComplete suggestions={this.props.categories}
                                          className={classes.ExpenseFilterFilterField}
                                          onChange={this.onCategoryChange}
                                          value={this.state.category}
                                          label="Kategoria"/>
                        </div>
                    </div>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    <Button variant="contained" color="secondary" onClick={this.onSearch}>
                        <SearchIcon/>
                        Szukaj
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
}

ExpenseFilter.propTypes = {
    onSearch: PropTypes.func,
    filter: PropTypes.object,
    categories: PropTypes.array
};

export default withStyles(styles)(ExpenseFilter);
