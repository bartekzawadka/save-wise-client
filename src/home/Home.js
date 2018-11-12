import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import {withStyles} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import './Home.css';
import {Link} from "react-router-dom";
import Zoom from "@material-ui/core/Zoom/Zoom";

const styles = theme => ({
    landingPageTitle: {
        color: grey['500']
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4,
    },
    zoom: {
      transitionDelay: `${theme.transitions.duration.leavingScreen}ms`
    },
    newPlanButton: {
        marginTop: '24px'
    },
    transitionDuration: {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    }
});

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            budgetPlans: []
        }
    }

    componentDidMount() {

    }

    render() {
        const {classes} = this.props;

        let content;

        if (!this.state.budgetPlans || this.state.budgetPlans.length === 0) {
            content =
                <div>
                    <Grid container direction="column" alignItems="center" justify="center" className="landing-pane">
                        <Grid item>
                            <Typography variant="h3" className={classes.landingPageTitle}>
                                Nie masz jeszcze żadnego planu budżetowego!
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" className={classes.newPlanButton}
                                    component={Link} to='/budgets/new'>
                                <AddIcon/>
                                Utwóż nowy
                            </Button>
                        </Grid>
                    </Grid>
                    <Zoom
                        key='secondary'
                        in='true'
                        timeout={classes.transitionDuration}
                        style={{
                            transitionDelay: `${classes.transitionDuration.exit}ms`,
                        }}
                        unmountOnExit
                    >
                        <Button variant="extendedFab" className={classes.fab} color='secondary'>
                            <AddIcon/>
                            Dodaj wydatek
                        </Button>
                    </Zoom>
                </div>;
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

export default withStyles(styles)(Home);
