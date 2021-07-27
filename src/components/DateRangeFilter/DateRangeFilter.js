import 'date-fns';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const DateRangeFilter = ({ startTime, setStartTime, endTime, setEndTime }) => {
      const classes = useStyles();

    return (
        <div className={classes.root}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Paper className={classes.paper}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        spacing ={2}
                    >
                        <Grid item >
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="From"
                                value={startTime}
                                onChange={(date)=> {setStartTime(date)}}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="To"
                                value={endTime}
                                onChange={(date)=> {setEndTime(date)}}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </MuiPickersUtilsProvider>
        </div>
    );
};

export default DateRangeFilter;
