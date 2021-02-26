import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import TestHelp from './TestHelp/TestHelp.js';
import TestResults from './TestResults/TestResults.js';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%',
    },
    containerPaper: {
        margin:15,
        padding: theme.spacing(4),
        display: 'flex',
        height: 'calc(100vh - 100px)',
    },
}));

const ResultsScreen = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.containerPaper} >
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper} elevation={3}>
                        <TestResults />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper} elevation={3}>
                        <TestHelp />
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default ResultsScreen;
