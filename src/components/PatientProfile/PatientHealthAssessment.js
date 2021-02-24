import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Step,
	StepContent,
	StepLabel,
	Stepper,
} from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import existsInArray from '../../helpers/existsInArray';
import DocButton from '../DocButton/DocButton';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import TextInputElement from '../FormComponents/TextInputElement';
import MaterialCheckbox from '../MaterialCheckbox/MaterialCheckbox';
import bookingUserDataService from '../../services/bookingUserDataService';
import LinkButton from '../DocButton/LinkButton';

const PatientHealthAssessment = () => {
	const { role, token } = useContext(AuthContext);
	const [hra_data, setHRAData] = useState();
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
		if (!!token) {
			bookingUserDataService
				.getHRAData(token)
				.then(result => {
					if (result.success && result.hra_data) {
						setHRAData(result.hra_data);
					}
				})
				.catch(() => console.log('err'));
		}
	}, []);

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
			if (healthConditions.length === 0) {
				let newConditions = healthConditions;
				newConditions.push(field);
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
			.submitHealthAssessment(token, body)
			.then(result => {
				if (!result && result.success) {
					ToastsStore.error('Failed to submit health assessment');
				}
			})
			.catch(err => ToastsStore.error('Failed to submit health assessment'));
	}

	return (
		<BigWhiteContainer>
			{!!hra_data ? (
				<div className='profile-grid' style={{ padding: '73px 155px 0px 155px' }}>
					<div className='row items-start flex-wrap'>
						<div className='title-col sm-12 md-4 lg-4'>
							<h3 className='no-margin'>Health Profile</h3>
						</div>
						<div className='col content-col sm-12 md-8 lg-8'>
							<div className='row items-start'>
								<div className='subtitle-col'>
									<h3 className='no-margin'>About You</h3>
								</div>
								<div>
									<div className='row' style={{ flexWrap: 'wrap' }}>
										<TextInputElement
											label='Height (cm)'
											value={hra_data.height}
											onChange={() => null}
											placeholder='Height (cm)'
											type='number'
											inputProps={{ min: 1, max: 300, step: 1 }}
											disabled={true}
											style={{ width: '200px', marginRight: '20px', marginTop: '20px' }}
										/>
										<TextInputElement
											label='Weight (kg)'
											value={hra_data.weight}
											onChange={() => null}
											placeholder='Weight (kg)'
											type='number'
											inputProps={{ min: 20, max: 250 }}
											disabled={true}
											style={{ width: '200px', marginTop: '20px' }}
										/>
									</div>
									<div className='row'>
										<FormControl component='fieldset'>
											<FormLabel component='legend'>Sex *</FormLabel>
											<RadioGroup
												style={{ display: 'inline' }}
												aria-label='sex'
												name='sex'
												value={hra_data.sex}
												onChange={() => null}
											>
												<FormControlLabel value='Female' control={<Radio />} label='Female' />
												<FormControlLabel value='Male' control={<Radio />} label='Male' />
											</RadioGroup>
										</FormControl>
									</div>
									<div className='row'>
										<FormControl component='fieldset'>
											<FormLabel component='legend'>Do you smoke?</FormLabel>
											<RadioGroup
												style={{ display: 'inline' }}
												aria-label='sex'
												name='smoking'
												value={hra_data.smoking}
												onChange={() => null}
												disabled={true}
											>
												<FormControlLabel value={true} control={<Radio />} label='Yes' />
												<FormControlLabel value={false} control={<Radio />} label='No' />
											</RadioGroup>
										</FormControl>
									</div>
								</div>
							</div>
							<div className='row items-start'>
								<div className='subtitle-col'>
									<h3 className='no-margin'>Your Health</h3>
								</div>

								<div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(1)}
											labelComponent='Active Cancer'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(2)}
											labelComponent='Disease or medicines that weaken the immune system'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(3)}
											labelComponent='Diabetes'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(4)}
											labelComponent='Cardiovascular disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(5)}
											labelComponent='History of chronic lung disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(6)}
											labelComponent='History of chronic liver disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(7)}
											labelComponent='History of chronic kidney disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.health_conditions === null}
											labelComponent='none'
											onChange={() => null}
										/>
									</div>
								</div>
							</div>
							<div className='row items-start'>
								<div className='subtitle-col'>
									<h3 className='no-margin'>Family Health</h3>
								</div>

								<div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(1)
											}
											labelComponent='Active Cancer'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(2)
											}
											labelComponent='Disease or medicines that weaken the immune system'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(3)
											}
											labelComponent='Diabetes'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(4)
											}
											labelComponent='Cardiovascular disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(5)
											}
											labelComponent='History of chronic lung disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(6)
											}
											labelComponent='History of chronic liver disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={
												hra_data.family_health_conditions !== null &&
												hra_data.family_health_conditions.includes(7)
											}
											labelComponent='History of chronic kidney disease'
											onChange={() => null}
										/>
									</div>
									<div className='row'>
										<MaterialCheckbox
											value={hra_data.family_health_conditions === null}
											labelComponent='none'
											onChange={() => null}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div style={{ maxWidth: '95%', width: '500px', margin: 'auto' }}>
					<div style={{ padding: '15px', marginTop: '20px', marginBottom: '20px' }}>
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
													linkSrc={`/${role.name}/dashboard`}
												/>
											</div>
										</StepContent>
									)}
								</Step>
							))}
						</Stepper>
					</div>
				</div>
			)}
		</BigWhiteContainer>
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
