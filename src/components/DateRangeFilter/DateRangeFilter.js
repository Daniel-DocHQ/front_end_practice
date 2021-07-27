import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import datePickerTheme from '../../helpers/datePickerTheme';


const DateRangeFilter = ({ startTime, setStartTime, endTime, setEndTime }) => {
    const pickerTheme = datePickerTheme();

    return (
        <ThemeProvider theme={pickerTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    spacing={2}
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
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
};

export default DateRangeFilter;
