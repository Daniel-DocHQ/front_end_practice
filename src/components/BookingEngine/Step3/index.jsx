import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import cardIcons from '../assets/card-icons.png';
import './index.scss';
import { format } from 'date-fns';
import { discountSvc } from '../services/discount';
import { useEffect } from 'react';

const df = function(st) {
	var d = new Date(st);

	var hours = d.getUTCHours() < 10 ? '0' + d.getUTCHours() : d.getUTCHours();
	var min = d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes() : d.getUTCMinutes();

	return hours + ':' + min;
};

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200,
			color: '#A2A2A2',
		},
		paddingRight: 12,
		width: '50%',
	},
	flex: {
		display: 'flex',
		flexDirection: 'row',
	},
	inputGroup: {
		width: 160,
		'& .label': {
			fontSize: 9,
			marginLeft: 7,
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			textTransform: 'uppercase',
		},
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column',
	},
	p: {
		fontSize: 12,
		color: '#333333',
	},
	pSuccess: {
		fontSize: 18,
		color: 'green',
		fontWeight: 700,
	},
	pError: {
		fontSize: 18,
		color: 'red',
		fontWeight: 700,
	},
	link: {
		fontWeight: 700,
		color: '#2B9EE3',
		textDecoration: 'none',
	},
	formGroupTitle: {
		margin: '1rem 0.5rem 0',
		fontSize: '0.9rem',
	},
}));

const validateField = (fieldValues, discountIsValid) => {
	const errors = {};

	for (let fieldName in fieldValues) {
		const value = fieldValues[fieldName];
		switch (fieldName) {
			case 'email':
				const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				if (!emailValid) errors[fieldName] = 'Input email is invalid';
				break;
			case 'expiry':
				const expiryValid = value.match(/^([0-9]{2})\/([0-9]{2})$/i);
				if (!expiryValid) errors[fieldName] = 'Invalid expiry date';
				break;
			case 'card_name':
			case 'billing_address':
				const isValid = value.length >= 3;
				if (!isValid) errors[fieldName] = 'Input is invalid';
				break;
			case 'billing_postcode':
				const rxp = /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i;
				if (!rxp.test(value)) errors[fieldName] = 'Invalid postcode';
				break;
			case 'cvv':
				const _isValid = value.match(/^([0-9]{3,4})$/i);
				if (!_isValid)
					errors[fieldName] = 'The last three to four digits on the back of your card.';
				break;
			case 'tocAgree':
				if (!value)
					errors[fieldName] =
						"You need to agree to DocHQ's Terms & Conditions and Privacy Policies";
				break;
			case 'card_number':
				const _isValidCC = value.match(/^[0-9]{12,19}$/i);
				if (!_isValidCC) errors[fieldName] = 'Credit card number must be 12-19 digits.';
				break;
			default:
				break;
		}
	}

	return errors;
};

export default function Step3({ setStepData, stepData }) {
	const classes = useStyles();
	const [_stepData, updateLocalData] = useState({});
	const [errors, setErrors] = useState({});
	const step0 = stepData.step0;
	const step1 = stepData.step1;
	const loadedData = stepData.step3 ? stepData.step3 : { data: {}, fields: [] };
	const [lastKeyPress, updateLastKeyPress] = useState('');
	const [discountCodeIsValid, updateDiscountCode] = useState({ valid: false });
	const getURLParameters = url =>
		(url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
			(a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
			{}
		);
	const isDiscountEnabled = params => {
		const paramNames = Object.keys(params);
		if (paramNames.includes('dc')) {
			return false;
		} else {
			return true;
		}
	};
	const urlParams = getURLParameters(window.location.href);
	const discountCodeEnabled = isDiscountEnabled(urlParams);
	console.log(urlParams);
	console.log(isDiscountEnabled(urlParams));
	const fields = [
		'card_name',
		'billing_street',
		'billing_locality',
		'billing_region',
		'billing_postcode',
		'card_number',
		'expiry',
		'cvv',
		'tocAgree',
		'discount_code',
	];

	const update = (field, data) => {
		_stepData[field] = data;
		if (
			field === 'expiry' &&
			_stepData['expiry'].includes('/') &&
			_stepData['expiry'].length === 3 &&
			lastKeyPress === 'Backspace'
		) {
			_stepData['expiry'] = _stepData['expiry'].substring(0, 2);
		}
		if (
			field === 'expiry' &&
			_stepData['expiry'].length === 2 &&
			!_stepData['expiry'].includes('/') &&
			lastKeyPress !== 'Backspace'
		) {
			_stepData['expiry'] = _stepData['expiry'] + '/';
		}

		const _errors = validateField(_stepData, discountCodeIsValid.valid);
		setErrors(_errors);
		updateLocalData(_stepData);

		if (field === 'tocAgree' && data === false) {
			delete _stepData[field];
			setImmediate(() => setStepData('step3', { data: _stepData, fields }));
		}

		setImmediate(() => setStepData('step3', { data: _stepData, fields }));
	};

	useEffect(() => {
		updateDiscountCode({ valid: false });

		discountSvc
			.getDiscountDetails(_stepData['discount_code'])
			.then(data => {
				console.log('isValid ', data.valid);
				if (data.valid && data.type && data.value) {
					updateDiscountCode(data);
				} else if (!data.valid && data.reason) {
					updateDiscountCode(data);
				}
			})
			.catch(err => {
				updateDiscountCode({
					valid: false,
					error: err.error,
					errorMsg: err.errorMsg,
				});
			});
	}, [_stepData['discount_code']]);
	return (
		<div className={classes.flex + ' step3'}>
			<form className={classes.root} noValidate autoComplete='off'>
				<div className={classes.flex}>
					<TextField
						id='card-name-error-helper-text'
						label='Name on card'
						autoComplete='cc-name'
						error={!!errors.card_name}
						helperText={errors.card_name ? errors.card_name : null}
						// defaultValue={loadedData.data.card_name}
						defaultValue=''
						onChange={event => update('card_name', event.target.value)}
						style={{ flex: 2 }}
					/>
				</div>
				<div className={classes.flex}>
					<h3 className={classes.formGroupTitle}>Billing Address</h3>
				</div>
				<div className={classes.flex}>
					<TextField
						error={!!errors.billing_street}
						helperText={errors.billing_street ? errors.billing_street : null}
						id='billing-street-error-helper-text'
						label='Street'
						autoComplete='billing address-line1'
						// defaultValue={loadedData.data.billing_street}
						defaultValue=''
						onChange={event => update('billing_street', event.target.value)}
						style={{ flex: 2 }}
					/>
					<TextField
						error={!!errors.billing_locality}
						helperText={errors.billing_locality ? errors.billing_locality : null}
						id='billing-locality-error-helper-text'
						label='Town'
						autoComplete='billing locality'
						// defaultValue={loadedData.data.billing_locality}
						defaultValue=''
						onChange={event => update('billing_locality', event.target.value)}
						style={{ flex: 2 }}
					/>
				</div>
				<div className={classes.flex}>
					<TextField
						error={!!errors.billing_region}
						helperText={errors.billing_region ? errors.billing_region : null}
						id='billing-region-error-helper-text'
						label='County'
						autoComplete='billing region'
						// defaultValue={loadedData.data.billing_region}
						defaultValue=''
						onChange={event => update('billing_region', event.target.value)}
						style={{ flex: 2 }}
					/>
					<TextField
						error={!!errors.billing_postcode}
						helperText={errors.billing_postcode ? errors.billing_postcode : null}
						id='billing-postcode-error-helper-text'
						label='Postcode'
						autoComplete='billing postal-code'
						// defaultValue={loadedData.data.billing_postcode}
						defaultValue=''
						onChange={event => update('billing_postcode', event.target.value)}
						style={{ flex: 2 }}
					/>
				</div>
				<div className={classes.flex}>
					<TextField
						error={!!errors.card_number}
						helperText={errors.card_number ? errors.card_number : null}
						id='billing-card-number-error-helper-text'
						label='Card number'
						defaultValue=''
						autoComplete='cc-number'
						onChange={event => update('card_number', event.target.value)}
						style={{ flex: 2 }}
					/>
				</div>
				<div className={classes.flex}>
					<img src={cardIcons} alt={'Card Icons'} />
				</div>
				<div className={classes.flex}>
					<TextField
						error={!!errors.expiry}
						helperText={errors.expiry ? errors.expiry : null}
						id='billing-expiry-error-helper-text'
						label='Expiry'
						placeholder={'MM/YY'}
						defaultValue=''
						value={_stepData['expiry']}
						onChange={event => {
							update('expiry', event.target.value);
						}}
						onKeyDown={e => {
							updateLastKeyPress(e.key);
						}}
						style={{ flex: 1 }}
					/>
					<TextField
						id='billing-cv2-error-helper-text'
						label='CV2'
						defaultValue=''
						placeholder={'CV2'}
						error={!!errors.cvv}
						helperText={
							errors.cvv ? errors.cvv : 'The last three to four digits on the back of your card.'
						}
						onChange={event => update('cvv', event.target.value)}
						style={{ flex: 1 }}
					/>
				</div>
				<div className={classes.flex}>
					<FormControl
						required
						error={!!errors.tocAgree}
						component='fieldset'
						className={classes.formControl}
					>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										onChange={event => update('tocAgree', event.target.checked)}
										defaultValue={false}
										color='primary'
									/>
								}
								label={
									<p className={classes.p}>
										I have read and understand the{' '}
										<a
											href='#'
											data-toggle='modal'
											data-target='#TOCModal'
											className={classes.link}
										>
											DocHQ T&Cs
										</a>{' '}
										and{' '}
										<a
											href='https://dochq.co.uk/privacy-policy'
											target='_blank'
											className={classes.link}
										>
											Privacy Policy
										</a>{' '}
										carefully
									</p>
								}
							/>
						</FormGroup>
						{!!errors.tocAgree && (
							<FormHelperText style={{ marginTop: 0 }}>{errors.tocAgree}</FormHelperText>
						)}
					</FormControl>
				</div>
				<div className={classes.flex}>
					<FormControlLabel
						control={
							<Checkbox
								onChange={event => update('subscription', event.target.checked)}
								defaultValue={false}
								color='primary'
							/>
						}
						label={
							<p className={classes.p}>
								I’d like to be kept up to date with the latest <strong>DocHQ</strong> offers and
								services
							</p>
						}
					/>
				</div>
			</form>
			<div className={classes.flexColumn}>
				<p>
					<strong>Please enter your payment details.</strong>
				</p>
				<div>
					<p>VideoGP appointment</p>
					<div className={classes.flex}>
						<div style={{ flex: 1 }}>Time:</div>
						<div style={{ flex: 2 }}>
							{format(new Date(step1.data.slotTime), 'do MMMM yyyy')} at {df(step1.data.slotTime)}
						</div>
					</div>
					<div className={classes.flex}>
						<div style={{ flex: 1 }}>Location:</div>
						<div style={{ flex: 2 }}>
							<p>
								{step0.data.locationData ? step0.data.locationData.address : step0.data.postcode}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const DiscountSuccess = props => {
	const classes = useStyles();
	if (props.valid === true && props.type && props.value) {
		const successMessage = `Your ${props.value.toString()}${
			props.type === 'percentage' ? '%' : '£'
		} discount will be applied at checkout`;
		return (
			<React.Fragment>
				<p className={classes.pSuccess}>{successMessage}</p>
			</React.Fragment>
		);
	} else if (props.discountCode && props.discountCode.length >= 3) {
		return (
			<React.Fragment>
				<p className={classes.pError}>Please enter a valid discount code</p>
			</React.Fragment>
		);
	} else {
		return <React.Fragment></React.Fragment>;
	}
};
