import {
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Paper,
	Radio,
	RadioGroup,
	Step,
	StepContent,
	StepLabel,
	Stepper,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import existsInArray from '../../helpers/existsInArray';
import DocButton from '../DocButton/DocButton';
import TextInputElement from '../FormComponents/TextInputElement';
import MaterialCheckbox from '../MaterialCheckbox/MaterialCheckbox';
import firstCharUpper from '../../helpers/firstCharUpper';
import bookingUserDataService from '../../services/bookingUserDataService';
import { ToastsStore } from 'react-toasts';
import LinkButton from '../DocButton/LinkButton';

const PatientHealthAssessment = props => {
	const [smoking, setSmoking] = useState();
	const [sex, setSex] = useState();
	const [height, setHeight] = useState();
	const [weight, setWeight] = useState();
	const [healthConditions, setHealthConditions] = useState([]);
	const [familyHealthConditions, setFamilyHealthConditions] = useState([]);
	const [activeStep, setActiveStep] = useState(0);
	const [riskStatus, setRiskStatus] = useState();
	const [error, setError] = useState(false);
	const steps = ['About You', 'Your Health', 'Family Health', 'Result'];
	const [sentResult, setSentResult] = useState(false);

	useEffect(() => {
		if (activeStep === 3 && !sentResult) {
			//TODO make api call to store results
			submitResults();
			setSentResult(true);
		}
	}, [activeStep, setActiveStep]);

	function updateHealthConditions(value, field, isFamily) {
		if (isFamily) {
			if (familyHealthConditions.length === 0) {
				let newConditions = familyHealthConditions;
				newConditions.push(field);
				setFamilyHealthConditions(newConditions);
			} else if (value && !existsInArray(familyHealthConditions, field)) {
				let newConditions = familyHealthConditions;
				newConditions.push(field);

				setFamilyHealthConditions(newConditions);
			} else if (!value && existsInArray(familyHealthConditions, field)) {
				const newConditions = familyHealthConditions.filter(item => item !== field);
				setFamilyHealthConditions(newConditions);
			}
		} else {
			console.log(healthConditions.length);
			if (healthConditions.length === 0) {
				let newConditions = healthConditions;
				newConditions.push(field);
				console.log(newConditions);
				setHealthConditions(newConditions);
			} else if (value && !existsInArray(healthConditions, field)) {
				let newConditions = healthConditions;
				newConditions.push(field);
				setHealthConditions(newConditions);
			} else if (!value && existsInArray(healthConditions, field)) {
				const newConditions = healthConditions.filter(item => item !== field);
				setHealthConditions(newConditions);
			}
		}
	}

	function determineRiskStatus() {
		let risk;
		if (isHighRisk()) {
			risk = 'high';
		} else if (isMediumRisk()) {
			risk = 'medium';
		} else {
			risk = 'low';
		}
		setRiskStatus(risk);
	}

	function isObese(height, weight) {
		let bmi = parseFloat(weight) / parseFloat(height / 100) ** 2;
		return bmi >= 30;
	}

	function isHighRisk() {
		return (
			healthConditions.length > 0 ||
			(isObese(height, weight) && familyHealthConditions.length > 0) ||
			(familyHealthConditions.length > 0 && smoking)
		);
	}

	function isMediumRisk() {
		return familyHealthConditions.length > 0 || smoking;
	}

	function nextStep() {
		if (activeStep === 0) {
			if (
				typeof sex !== 'undefined' &&
				typeof height === 'number' &&
				typeof weight === 'number' &&
				typeof smoking !== 'undefined'
			) {
				setActiveStep(activeStep + 1);
			} else {
				setError(true);
			}
		} else {
			setActiveStep(activeStep + 1);
		}
		determineRiskStatus();
	}
	function backStep() {
		setActiveStep(activeStep !== 0 ? activeStep - 1 : 0);
	}

	function submitResults() {
		const body = {
			sex,
			height: parseFloat(height),
			weight: parseFloat(weight),
			smoking: smoking === 'true' ? true : false,
			health_conditions: healthConditions,
			family_health_conditions: familyHealthConditions,
		};
		bookingUserDataService
			.submitHealthAssessment(props.token, body)
			.then(result => {
				if (result && result.success) {
					ToastsStore.success('Submitted health assessment');
				} else {
					ToastsStore.error('Failed to submit health assessment');
				}
			})
			.catch(err => ToastsStore.error('Failed to submit health assessment'));
	}

	return (
		<React.Fragment>
			<div style={{ maxWidth: '95%', width: '500px', margin: 'auto' }}>
				<Paper style={{ padding: '15px', marginTop: '20px', marginBottom: '20px' }}>
					<div className='row center'>
						<h2>Health Profile</h2>
					</div>
					<Stepper activeStep={activeStep} orientation='vertical'>
						{steps.map((label, i) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
								{activeStep === 0 && (
									<StepContent key={i}>
										<div className='row'>
											<TextInputElement
												label='Height (cm)'
												value={height}
												onChange={height => setHeight(parseFloat(height))}
												placeholder='Height (cm)'
												type='number'
												inputProps={{ min: 1, max: 300, step: 1 }}
											/>
										</div>
										{error && typeof height !== 'number' && (
											<div className='row'>
												<p style={{ color: 'var(--doc-orange' }}>Enter your height (cm)</p>
											</div>
										)}
										<div className='row'>
											<TextInputElement
												label='Weight (kg)'
												value={weight}
												onChange={weight => setWeight(parseFloat(weight))}
												placeholder='Weight (kg)'
												type='number'
												inputProps={{ min: 20, max: 250 }}
											/>
										</div>
										{error && typeof weight !== 'number' && (
											<div className='row'>
												<p style={{ color: 'var(--doc-orange' }}>Enter your weight (kg)</p>
											</div>
										)}
										<div className='row'>
											<FormControl component='fieldset'>
												<FormLabel component='legend'>Sex *</FormLabel>
												<RadioGroup
													style={{ display: 'inline' }}
													aria-label='sex'
													name='sex'
													value={sex}
													onChange={e => setSex(e.target.value)}
												>
													<FormControlLabel value='Female' control={<Radio />} label='Female' />
													<FormControlLabel value='Male' control={<Radio />} label='Male' />
												</RadioGroup>
											</FormControl>
										</div>
										{error && typeof sex === 'undefined' && (
											<div className='row'>
												<p style={{ color: 'var(--doc-orange' }}>Select your sex</p>
											</div>
										)}
										<div className='row'>
											<FormControl component='fieldset'>
												<FormLabel component='legend'>Do you smoke? *</FormLabel>
												<RadioGroup
													style={{ display: 'inline' }}
													aria-label='sex'
													name='smoking'
													value={smoking}
													onChange={e => setSmoking(e.target.value === 'true' ? true : false)}
												>
													<FormControlLabel value='true' control={<Radio />} label='Yes' />
													<FormControlLabel value='false' control={<Radio />} label='No' />
												</RadioGroup>
											</FormControl>
										</div>
										{error && typeof smoking === 'undefined' && (
											<div className='row'>
												<p style={{ color: 'var(--doc-orange' }}>Select an option</p>
											</div>
										)}
										<div className='row'>
											<DocButton text='Next' onClick={nextStep} color='green' />
										</div>
									</StepContent>
								)}
								{activeStep === 1 && (
									<StepContent>
										<HealthConditions
											healthConditions={healthConditions}
											nextStep={nextStep}
											backStep={backStep}
											update={updateHealthConditions}
											isFamily={false}
										/>
									</StepContent>
								)}
								{activeStep === 2 && (
									<StepContent>
										<HealthConditions
											healthConditions={familyHealthConditions}
											nextStep={nextStep}
											backStep={backStep}
											update={updateHealthConditions}
											isFamily={true}
										/>
									</StepContent>
								)}
								{activeStep === 3 && (
									<StepContent key={i}>
										<div className='row center'>
											<h3>Thank you for completing your health profile.</h3>
										</div>

										<div className='row center'>
											<LinkButton
												text='Back to Home'
												color='green'
												linkSrc={`/${props.role}/dashboard`}
											/>
										</div>
									</StepContent>
								)}
							</Step>
						))}
					</Stepper>
				</Paper>
			</div>
		</React.Fragment>
	);
};

export default PatientHealthAssessment;

const HealthConditions = ({ healthConditions, update, nextStep, backStep, isFamily }) =>
	typeof isFamily !== 'undefined' && isFamily ? (
		<React.Fragment>
			<div className='col'>
				<h4 style={{ textAlign: 'center' }}>
					Select any of the following health conditions that apply to{' '}
					{isFamily ? ' your family' : ' you'}
				</h4>
				<ul style={{ listStyleType: 'none', paddingInlineStart: '10px' }}>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 3)}
							onChange={val => {
								update(val, 3, isFamily);
							}}
							labelComponent='Diabetes'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 4)}
							onChange={val => {
								update(val, 4, isFamily);
							}}
							labelComponent='Cardiovascular Disease'
						/>
					</li>
				</ul>
			</div>
			<div className='row'>
				<DocButton text='Back' onClick={backStep} flat style={{ marginRight: '50px' }} />
				<DocButton text='Next' onClick={nextStep} color='green' />
			</div>
		</React.Fragment>
	) : (
		<React.Fragment>
			<div className='col'>
				<h4 style={{ textAlign: 'center' }}>
					Select any of the following health conditions that apply to{' '}
					{isFamily ? ' your family' : ' you'}
				</h4>
				<ul style={{ listStyleType: 'none', paddingInlineStart: '10px' }}>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 1)}
							onChange={val => {
								update(val, 1, isFamily);
							}}
							labelComponent='Active Cancer'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 2)}
							onChange={val => {
								update(val, 2, isFamily);
							}}
							labelComponent='Diseases or medicines that weaken the immune system'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 3)}
							onChange={val => {
								update(val, 3, isFamily);
							}}
							labelComponent='Diabetes'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 4)}
							onChange={val => {
								update(val, 4, isFamily);
							}}
							labelComponent='Cardiovascular Disease'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 5)}
							onChange={val => {
								update(val, 5, isFamily);
							}}
							labelComponent='History of chronic lung disease'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 6)}
							onChange={val => {
								update(val, 6, isFamily);
							}}
							labelComponent='History of chronic liver disease'
						/>
					</li>
					<li>
						<MaterialCheckbox
							value={healthConditions.find(item => item === 7)}
							onChange={val => {
								update(val, 7, isFamily);
							}}
							labelComponent='History of chronic kidney disease'
						/>
					</li>
				</ul>
			</div>
			<div className='row'>
				<DocButton text='Back' onClick={backStep} flat style={{ marginRight: '50px' }} />
				<DocButton text='Next' onClick={nextStep} color='green' />
			</div>
		</React.Fragment>
	);
