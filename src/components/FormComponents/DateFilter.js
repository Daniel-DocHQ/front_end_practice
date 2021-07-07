import React  from 'react';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider } from '@material-ui/styles';
import datePickerTheme from '../../helpers/datePickerTheme';

const DateFilter = ({ date, setDate }) => {
    const pickerTheme = datePickerTheme();

    return (
        <div>
            <ThemeProvider theme={pickerTheme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <div className='row'>
                        <div className='appointment-calendar-container' style={{ alignItems: 'flex-end' }}>
                            <KeyboardDatePicker
                                label="Select Date"
                                placeholder="DD/MM/YYYY"
                                inputVariant='filled'
                                format="dd/MM/yyyy"
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                value={date}
                                onChange={(value) => {
                                    setDate(value);
                                }}
                            />
                        </div>
                    </div>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </div>
    );
};

export default DateFilter;
