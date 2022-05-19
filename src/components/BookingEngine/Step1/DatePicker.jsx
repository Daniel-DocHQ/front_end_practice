import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		marginBottom: '1.3rem',
		marginLeft: -7,
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200,
			fontSize: 100,
		},
		'& .MuiInputBase-input': {
			fontSize: '1rem !important',
			marginLeft: -5,
		},
		'& .MuiSvgIcon-root': {
			transform: 'scale(1.2)',
			marginTop: 4,
			marginLeft: 1,
		},
		'& .MuiIconButton-root': {
			marginLeft: -50,
		},
		'& .MuiInput-root': {
			marginLeft: 36,
		},
	},
}));
const minimumDate = new Date();
export function DatePicker({
	onDateSelect,
	minDate = minimumDate,
	maxDate = null,
	label = 'Choose a date',
	defaultValue = minimumDate,
}) {
	const [selectedDate, setSelectedDate] = React.useState(defaultValue);
	const classes = useStyles();
	const handleDateChange = date => {
		setSelectedDate(date);
		onDateSelect(date);
	};

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Grid className={classes.root}>
				<KeyboardDatePicker
					margin='normal'
					id='date-picker-dialog'
					label={label}
					format='dd/MM/yyyy'
					value={selectedDate}
					onChange={handleDateChange}
					minDate={minDate}
					maxDate={maxDate}
					InputAdornmentProps={{ position: 'start' }}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
				/>
			</Grid>
		</MuiPickersUtilsProvider>
	);
}
