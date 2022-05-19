import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';
import './index.scss';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200,
			color: '#A2A2A2',
		},
		paddingRight: 12,
	},
	flex: {
		display: 'flex',
		flexDirection: 'row',
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column',
	},
}));

const validateField = fieldValues => {
	const errors = {};

	for (let fieldName in fieldValues) {
		const value = fieldValues[fieldName];
		switch (fieldName) {
			case 'email':
				const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				if (!emailValid) errors[fieldName] = 'Input email is invalid';
				break;
			case 'first_name':
			case 'last_name':
				const isValid = value.length >= 2;
				if (!isValid) errors[fieldName] = 'Input is invalid';
				break;
			case 'telephone':
				const rgx = /^[0-9-+\s()]*/i;
				if (!rgx.test(value)) errors[fieldName] = 'Input telephone is invalid';
				break;
			default:
				break;
		}
	}

	return errors;
};

export default function Step2({ setStepData, stepData, handleBack }) {
	const classes = useStyles();
	const loadedData = stepData && stepData['step2'] ? stepData['step2'] : { fields: [], data: {} };
	const [localStepData, updateLocalData] = useState(loadedData.data);
	const [errors, setErrors] = useState({});
	const fields = ['first_name', 'last_name', 'dateOfBirth', 'telephone', 'email'];

	const update = (field, data) => {
		localStepData[field] = data;
		const _errors = validateField(localStepData);

		setErrors(_errors);
		updateLocalData(localStepData);

		setTimeout(() => setStepData('step2', { data: localStepData, fields }), 0);
	};

	return (
		<div className={classes.flex + ' step2'}>
			<form className={classes.root} noValidate autoComplete='off'>
				<div className={classes.flex}>
					<TextField
						error={!!errors.first_name}
						id='standard-error-helper-text'
						label='First name'
						autoComplete='given-name'
						defaultValue={loadedData.data.first_name}
						helperText={errors.first_name ? errors.first_name : null}
						onChange={event => update('first_name', event.target.value)}
						style={{ flex: 1 }}
					/>
					<TextField
						error={!!errors.last_name}
						id='standard-error-helper-text'
						label='Last name'
						autoComplete='family-name'
						defaultValue={loadedData.data.last_name}
						helperText={errors.last_name ? errors.last_name : null}
						onChange={event => update('last_name', event.target.value)}
						style={{ flex: 1 }}
					/>
				</div>
				<div className={classes.flex}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<DatePicker
							disableFuture
							openTo='year'
							format='dd/MM/yyyy'
							label='Date of birth'
							views={['year', 'month', 'date']}
							value={loadedData.data.dateOfBirth || null}
							onChange={date => {
								update('dateOfBirth', date);
								setStepData('step2', { data: localStepData, fields });
							}}
						/>
					</MuiPickersUtilsProvider>
					<TextField
						error={!!errors.telephone}
						id='standard-error-helper-text'
						label='Phone number'
						autoComplete='tel'
						helperText={errors.telephone ? errors.telephone : null}
						defaultValue={loadedData.data.telephone}
						onChange={event => update('telephone', event.target.value)}
						style={{ flex: 2 }}
						type='text'
					/>
				</div>
				<div className={classes.flex}>
					<TextField
						error={!!errors.email}
						id='standard-error-helper-text'
						label='Email address'
						autoComplete='email'
						helperText={errors.email ? errors.email : null}
						defaultValue={loadedData.data.email}
						onChange={event => update('email', event.target.value)}
						style={{ flex: 2 }}
					/>
				</div>
			</form>
			<div className={classes.flexColumn}>
				<p>
					<strong>Please provide us with this basic information.</strong>
				</p>
			</div>
		</div>
	);
}
