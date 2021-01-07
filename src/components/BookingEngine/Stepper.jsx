import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import getURLParams from '../../helpers/getURLParams';
import './assets/style.css';
import Finish from './Finish';
import Step1 from './Step1';
import Step2 from './Step2';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
}));

function isValid(fields, data) {
	let valid = {};

	fields.forEach(field => {
		valid[field] = true;
		if (
			(data[field] === '' && field !== 'discount_code') ||
			(typeof data[field] === 'undefined' && field !== 'discount_code') ||
			data[field] === null
		) {
			valid[field] = false;
		}
	});

	return Object.values(valid).filter(i => !i).length <= 0;
}

function getSteps() {
	return ['Select Time', 'Basic information', 'Finish'];
}

function getStepContent({ step, handleNext, setStepData, stepData, location, handleBack }) {
	switch (step) {
		case 0:
			return <Step1 setStepData={setStepData} handleNext={handleNext} location={location} />;
		case 1:
			return (
				<Step2
					setStepData={setStepData}
					location={location}
					handleBack={handleBack}
					stepData={stepData}
				/>
			);
		case 2:
			return (
				<Finish
					stepData={stepData}
					location={location}
					setStepData={setStepData}
					handleBack={handleBack}
				/>
			);
		default:
			return '';
	}
}

export function StepperContainer({ location, postcode, location_data }) {
	const classes = useStyles();
	const [_postcode, setPostcode] = useState(null);
	const [_location, setLocation] = useState(location);
	const [activeStep, setActiveStep] = useState(0);
	const [stepData, setStepData] = useState({
		step0: {
			data: { postcode: _postcode, locationData: location_data },
			fields: ['postcode', 'locationData'],
		},
	});
	const [canActivate, setCanActivate] = useState(false);
	const params = getURLParams(window.location.href);
	const steps = getSteps();

	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const _canActivate = step => {
		const fromStep = stepData[step];
		if (fromStep) {
			const _isValid = isValid(fromStep.fields, fromStep.data);
			if (_isValid) {
				return true;
			} else return false;
		}
		return false;
	};

	const _setStepData = (step, fromStep) => {
		stepData[step] = fromStep;

		setStepData(stepData);
		setCanActivate(_canActivate(step));
	};

	useEffect(() => {
		setLocation(location);
		setPostcode(postcode);

		stepData['step0'] = {
			data: Object.assign(stepData.step0, {
				postcode,
				locationData: location_data,
			}),
			fields: ['postcode', 'locationData'],
		};
		setStepData(stepData);
	}, [location, postcode, stepData, location_data]);

	useEffect(() => {
		setCanActivate(_canActivate(`step${activeStep + 1}`));
	}, [activeStep]);

	return typeof params === 'undefined' || typeof params['service'] === 'undefined' ? (
		<h1>Missing details, please book using the link in your email</h1>
	) : (
		<div className={classes.root}>
			<Stepper activeStep={activeStep} orientation='vertical'>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
						<StepContent>
							{getStepContent({
								step: index,
								handleNext,
								setStepData: _setStepData,
								stepData,
								location: _location,
								handleBack,
							})}

							{(index !== 0 || index === steps.length - 1) && (
								<div className={classes.actionsContainer}>
									{activeStep !== steps.length - 1 && (
										<div>
											<Button
												variant='contained'
												onClick={handleBack}
												className={classes.button}
												disableElevation={true}
											>
												Back
											</Button>
											<Button
												variant='contained'
												color='primary'
												disabled={!canActivate}
												onClick={handleNext}
												className={classes.button}
												disableElevation={true}
											>
												Next Step
											</Button>
										</div>
									)}
								</div>
							)}
						</StepContent>
					</Step>
				))}
			</Stepper>
		</div>
	);
}
