import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ExpensesSummaryChartWidget from "./widgets/ExpensesSummaryChartWidget";
import LeftToSpendWidget from "./widgets/LeftToSpendWidget";
import ExpensesPerCategoryWidget from "./widgets/ExpensesPerCategoryWidget";
import ExpenseCategoryShareWidget from "./widgets/ExpenseCategoryShareWidget";
import IncomesPerCategoryWidget from "./widgets/IncomesPerCategoryWidget";
import Button from "@material-ui/core/Button/Button";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListIcon from "@material-ui/icons/List";
import Chip from "@material-ui/core/Chip";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import InfoIcon from "@material-ui/icons/Info";

const styles = theme => ({
    PlanSummaryRoot: {
        marginTop: '30px',
        maxWidth: '960px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '50px'
    },
    PlanSummaryGrow: {
        flexGrow: 1
    },
    PlanSummaryPaper: {
        padding: theme.spacing.unit * 2,
    },
    PlanSummaryTitleContainer: {
        marginBottom: 5
    },
    PlanSummaryTitleButtonBarButton: {
        marginRight: theme.spacing.unit * 2,
    },
    PlanSummaryTitleButtonBarRightButton: {
        float: 'right'
    },
    PlanSummaryChip: {
        marginBottom: theme.spacing.unit * 2
    },
    PlanSummaryChipContentError: {
        color: "#ff3d00",
        borderColor: "#ff3d00"
    },
    PlanSummaryUpcominEndNotification: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2
    },
    PlanSummaryNewPlanButton: {
        marginLeft: theme.spacing.unit
    }
});

class PlanSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            budget: this.props.plan,
            incomesMissing: false
        }
    }

    componentDidMount() {
        let incomesSum = 0.0;
        try {
            if (this.state.budget.incomesSum) {
                incomesSum = parseFloat(this.state.budget.incomesSum);
            }
        } catch {
        }

        if (incomesSum === 0.0) {
            this.setState({
                incomesMissing: true
            });
        }
    }

    getIncomesMissingAlert = () => {
        if (this.state.incomesMissing) {
            return <div align="center">
                <Chip
                    align="center"
                    label="Nie określono rzeczywistych przychodów!"
                    className={this.props.classes.PlanSummaryChip}
                    variant="outlined"
                    color="secondary"
                    classes={{
                        outlinedSecondary: this.props.classes.PlanSummaryChipContentError
                    }}
                    icon={<ErrorOutlineIcon />} />
            </div>;
        }
    };

    getUpcommingEndOfPeriodAlert = () => {
        if (!this.state.budget) {
            return;
        }

        let oneDay = 1000 * 60 * 60 * 24;

        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let endDate = new Date(this.state.budget.endDate.toString());
        endDate.setHours(0, 0, 0, 0);

        let diff = endDate - currentDate;

        if (diff >= 0 && diff <= Math.round(diff / (oneDay * 2))) {
            return <div align="center" className={this.props.classes.PlanSummaryUpcominEndNotification}>
                <Typography variant="h6" color="textSecondary">
                    Okres rozliczeniowy zbliża się do końca -
                    <Button variant="flat"
                        color="primary"
                        size="small"
                        className={this.props.classes.PlanSummaryNewPlanButton}
                        component={Link}
                        to="/budgets/new">
                        Utwórz nowy plan
                    </Button>
                </Typography>

            </div>;
        }
    };

    render() {
        const { classes } = this.props;

        return <div className={classes.PlanSummaryRoot}>
            {this.getIncomesMissingAlert()}
            {this.getUpcommingEndOfPeriodAlert()}
            <Grid container alignItems="stretch" justify="center" spacing={8}>
                <Grid item xs={12}>
                    <Paper elevation={1} className={classes.PlanSummaryPaper}>
                        <div className={classes.PlanSummaryTitleContainer}>
                            <Typography variant="h6" color="inherit" className={classes.PlanSummaryGrow}>
                                Bieżąca realizacja budżetu
                                ({moment(this.props.plan.startDate).format('L') + " - " + moment(this.props.plan.endDate).format('L')})
                            </Typography>
                        </div>
                        <div>
                            <Button color="primary"
                                variant="flat"
                                component={Link}
                                className={classes.PlanSummaryTitleButtonBarButton}
                                to={"/plan/incomes/" + this.props.plan.id}>
                                <AttachMoneyIcon />
                                Przychody
                            </Button>
                            <Button color="primary"
                                variant="flat"
                                className={classes.PlanSummaryTitleButtonBarButton}
                                component={Link} to={"/expenses/" + this.props.plan.id}>
                                <ListIcon />
                                Wydatki
                            </Button>
                            <Button color="secondary"
                                variant="contained"
                                className={classes.PlanSummaryTitleButtonBarRightButton}
                                component={Link}
                                to={"/expense/add/" + this.props.plan.id}>
                                <AddIcon />
                                Dodaj wydatek
                            </Button>
                        </div>
                    </Paper>
                </Grid>
                <LeftToSpendWidget plan={this.state.budget} />
                <ExpensesSummaryChartWidget plan={this.state.budget} />
                <ExpenseCategoryShareWidget plan={this.state.budget} />
                <ExpensesPerCategoryWidget plan={this.state.budget} />
                <IncomesPerCategoryWidget plan={this.state.budget} />
            </Grid>
        </div>
    }
}

PlanSummary.propTypes = {
    classes: PropTypes.object.required,
    plan: PropTypes.object.required
};


export default withStyles(styles)(PlanSummary);
