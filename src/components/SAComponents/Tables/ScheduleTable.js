import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import { Field, useFormikContext } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
} from '@material-ui/pickers';
import {
    ThemeProvider,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
	Checkbox,
	FormControlLabel,
	FormGroup,
    FormControl,
} from '@material-ui/core';
import datePickerTheme from '../../../helpers/datePickerTheme';
import '../../Tables/Tables.scss';

const styles = {
	tableText: {
		fontSize: 16,
	},
	bntStyles: {
		marginLeft: '10px',
		marginTop: '0px',
		marginRight: '10px',
		boxSizing: 'border-box',
		maxWidth: '40%',
	},
	mainContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
    },
    snackbar: {
        color: '#FFF',
    }};

const ScheduleTable = ({ name, isView }) => {
    const pickerTheme = datePickerTheme();
    const { values, setFieldValue } = useFormikContext();
    const { opening_times } = values;
    console.log(values);

    return (
        <ThemeProvider theme={pickerTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TableContainer style={{ marginBottom: '40px'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' padding="checkbox" style={styles.tableText}>
                                    <Checkbox
                                        disabled={isView}
                                        value={!![...opening_times].filter(({ active }) => active).length}
                                        onChange={(e, value) => (
                                            setFieldValue(name, [...opening_times].map((item) => ({ ...item, active: value })))
                                        )}
                                    />
                                </TableCell>
                                <TableCell align='center' style={styles.tableText}>Days</TableCell>
                                <TableCell align='center' style={styles.tableText}>Opening Time</TableCell>
                                <TableCell align='right' style={styles.tableText}>Closing time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {opening_times.map((row, indx) => (
                                <TableRow key={row.weekday}>
                                    <TableCell
                                        align='left'
                                        style={{ ...styles.tableText }}
                                    >
                                        <Field name={`${name}[${indx}].active`} type="checkbox">
                                            {({ field }) => (
                                                <FormControl
                                                    component='fieldset'
                                                >
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    {...field}
                                                                    disabled={isView}
                                                                    value={opening_times[indx].active}
                                                                />
                                                            }
                                                        />
                                                    </FormGroup>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {row.day}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        <Field name={`${name}[${indx}].start_hour`}>
                                            {({ field, form }) => (
                                                <KeyboardTimePicker
                                                autoOk
                                                {...field}
                                                disabled={isView}
                                                placeholder="00:00 AM/PM"
                                                inputVariant='standard'
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                            )}
                                        </Field>
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        style={{ ...styles.tableText }}
                                    >
                                        <Field name={`${name}[${indx}].end_hour`}>
                                            {({ field, form }) => (
                                                <KeyboardTimePicker
                                                autoOk
                                                {...field}
                                                disabled={isView}
                                                placeholder="00:00 AM/PM"
                                                inputVariant='standard'
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                            )}
                                        </Field>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
};


export default memo(ScheduleTable);
