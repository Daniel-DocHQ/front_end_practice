import { createMuiTheme } from '@material-ui/core';

const datePickerTheme = () => createMuiTheme({
	overrides: {
		MuiTypography: {
			colorPrimary: { color: 'var(--doc-pink)' },
		},
		MuiPickersMonth: { monthSelected: { color: 'var(--doc-pink)' } },
		MuiPickersDay: {
			daySelected: {
				'&:hover': { backgroundColor: 'inherit' },
				backgroundColor: 'inherit',
				MuiIconButton: {
					label: { color: 'var(--doc-pink)' },
				},
			},
			current: {
				color: 'var(--doc-white)',
			},
			dayDisabled: {
				color: 'var(--doc-dark-grey)',
				opacity: '0.5',
				backgroundColor: 'var(--doc-white)!important',
			},
			hidden: {
				opacity: '0 !important',
			},
			day: {
				width: '24px',
				height: '24px',
				marginTop: '5px',
				marginBottom: '5px',
				color: 'var(--doc-black)',
                background: 'var(--doc-white)!important',
			},
		},
		MuiIconButton: {
			label: {
				backgroundColor: 'inherit',
				color: 'inherit',
				transition: '0.3s',
				'&:hover': { backgroundColor: 'var(--doc-pink)', color: 'var(--doc-white)' },
				borderRadius: '50%',
				height: '24px',
				width: '24px',
			},
		},
		MuiButton: {
			label: {
				color: 'var(--doc-green)',
			},
		},
		MuiPickersToolbar: {
			toolbar: { backgroundColor: 'var(--doc-green)' },
		},
		MuiPickersStaticWrapper: {
			staticWrapperRoot: {
				width: '90%',
				border: '2px solid var(--doc-green)',
				borderRadius: '10px',
				minWidth: '200px',
				maxWidth: '300px',
			},
		},
		MuiPickersToolbarText: {
			toolbarTxt: { fontSize: '22px' },
		},
		MuiPickersBasePicker: {
			pickerView: {
				maxWidth: '300px',
				minWidth: '200px',
			},
		},
		MuiPickersCalendar: {
			week: {
				justifyContent: 'space-evenly',
			},
		},
		MuiPickersCalendarHeader: {
			daysHeader: { justifyContent: 'space-evenly' },
			dayLabel: {
				width: 'auto',
			},
		},
	},
});

export default datePickerTheme;
