import { Paper, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import React, { Component } from 'react';
import MaterialCheckbox from '../../components/MaterialCheckbox/MaterialCheckbox';
import DocButton from '../../components/DocButton/DocButton';
import bookingUserDataService from '../../services/bookingUserDataService';

import { ToastsStore } from 'react-toasts';
import LinkButton from '../../components/DocButton/LinkButton';

export default class SymptomChecker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeStep: 0,
			steps: ['Main Symptoms', 'Symptom Status', 'Additional Symptoms', 'Social Contact', 'Result'],
			result: '',
			fever: false,
			cough: false,
			shortness_of_breath: false,
			loss_of_smell: false,
			worse: false,
			breathing_fast: false,
			cough_blood: false,
			symptomatic: false,
			high_risk_country: false,
			symptoms: [],
			symptom_options: [
				{ id: 1, name: 'Fatigue' },
				{ id: 2, name: 'Muscle pain' },
				{ id: 3, name: 'Chills' },
				{ id: 4, name: 'Headache' },
				{ id: 5, name: 'Diarrhoea' },
				{ id: 6, name: 'Nausea' },
				{ id: 7, name: 'Sore throat' },
			],
			social_contact: [1],
			social_contact_options: [
				{ id: 1, name: 'No Contact' },
				{
					id: 2,
					name:
						'I have provided direct care to such a person, without the use of a protective mask and gloves​',
				},
				{ id: 3, name: 'I had direct physical contact with such a person​' },
				{
					id: 4,
					name:
						'I had face-to-face contact with such a person within 1 meter (3 feet) for longer than 15 minutes​',
				},
			],
		};
		this.nextStep = nextStep.bind(this);
		this.setContactId = setContactId.bind(this);
		this.updateSymptoms = updateSymptoms.bind(this);
		this.updateSocialContacts = updateSocialContacts.bind(this);
		this.backStep = backStep.bind(this);
		this.submitSymptomCheckerResults = submitSymptomCheckerResults.bind(this);
		function backStep() {
			switch (this.state.activeStep) {
				case 1:
					this.setState({ activeStep: 0 });
					break;
				case 2:
					if (
						this.state.fever ||
						this.state.cough ||
						this.state.shortness_of_breath ||
						this.state.loss_of_smell
					) {
						this.setState({ activeStep: 1 });
					} else {
						this.setState({ activeStep: 0 });
					}
					break;
				case 3:
					this.setState({ activeStep: 2 });
					break;
				case 4:
					this.setState({ activeStep: 3 });
					break;
				default:
					break;
			}
		}
		function nextStep() {
			switch (this.state.activeStep) {
				case 0:
					if (
						this.state.fever ||
						this.state.cough ||
						this.state.shortness_of_breath ||
						this.state.loss_of_smell
					) {
						this.setState({ activeStep: 1 });
					} else {
						this.setState({ activeStep: 2 });
					}
					break;
				case 1:
					this.setState({ activeStep: 2 });

					break;
				case 2:
					this.setState({ activeStep: 3 });
					break;
				case 3:
					// SEND API CALL
					this.submitSymptomCheckerResults();
					break;
				default:
					break;
			}
		}

		function setContactId(id, value) {
			// if id === state.contact_id && !value, set to null
			// else set contact_id
			if (this.state.contact_id === value) {
				this.setState({ contact_id: null });
			} else {
				this.setState({ contact_id: id });
			}
		}

		function updateSymptoms(id, value) {
			if (value) {
				const symptoms = this.state.symptoms;
				symptoms.push(id);
				this.setState({ symptoms });
			} else if (typeof this.state.symptoms.find(item => item === id) !== 'undefined') {
				const symptoms = this.state.symptoms.filter(item => item !== id);
				this.setState({ symptoms });
			}
		}
		function updateSocialContacts(id, value) {
			if (value) {
				const social_contact = this.state.social_contact;
				social_contact.push(id);
				this.setState({ social_contact });
			} else if (typeof this.state.social_contact.find(item => item === id) !== 'undefined') {
				const social_contact = this.state.social_contact.filter(item => item !== id);
				this.setState({ social_contact });
			}
		}

		function submitSymptomCheckerResults() {
			const {
				contact_id,
				symptomatic,
				fever,
				cough,
				shortness_of_breath,
				loss_of_smell,
				worsening,
				breathing_fast,
				cough_blood,
				high_risk_country,
				symptoms,
			} = this.state;

			const formData = {
				contact_id: typeof contact_id === 'undefined' || contact_id === null ? 1 : contact_id,
				symptomatic,
				fever,
				cough,
				shortness_of_breath,
				loss_of_smell,
				worsening,
				breathing_fast,
				coughing_blood: cough_blood,
				high_risk_country,
				symptoms,
			};
			bookingUserDataService
				.submitSymptomChecker(this.props.token, formData)
				.then(response => {
					if (response.success) {
						//do nothing
						this.setState({ activeStep: 4, code: response.code, resultText: response.text });
						ToastsStore.success('Submitted Results');
					} else {
						// toast an error?
						ToastsStore.error('Error Submitting Results');
					}
				})
				.catch(err => {
					//toast an error
					ToastsStore.error('Error Submitting Results');
				});
		}
	}

	render() {
		return (
			<React.Fragment>
				<div style={{ maxWidth: '95%', width: '500px', margin: 'auto' }}>
					<Paper>
						<Stepper activeStep={this.state.activeStep} orientation='vertical'>
							{this.state.steps.map((label, i) => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
									{this.state.activeStep === 0 && (
										<StepContent>
											<div className='row'>
												<p>
													Do you have any of the following symptoms?<br></br>Please select only new
													symptoms that do not relate to any of your chronic diseases.
												</p>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.fever}
													labelComponent={
														<span>
															Fever<span style={{ color: 'var(--doc-orange)' }}>*</span>
														</span>
													}
													onChange={fever => this.setState({ fever })}
												/>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.cough}
													labelComponent='Cough'
													onChange={cough => this.setState({ cough })}
												/>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.shortness_of_breath}
													labelComponent={
														<span>
															Shortness of breath
															<span style={{ color: 'var(--doc-orange)' }}>**</span>
														</span>
													}
													onChange={shortness_of_breath => this.setState({ shortness_of_breath })}
												/>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.loss_of_smell}
													labelComponent='A loss or change to your sense of smell / taste'
													onChange={loss_of_smell => this.setState({ loss_of_smell })}
												/>
											</div>
											<div className='row'>
												<DocButton text='Next' onClick={this.nextStep} color='green' />
											</div>
											<p>
												<span style={{ color: 'var(--doc-orange)' }}>*</span> Elevated body
												temperature above 37.5&deg;C or 99.5&deg;F. Select this symptom, even if you
												haven’t measured your temperature, but you feel hot, feverish, or seem
												flushed
											</p>
											<p>
												<span style={{ color: 'var(--doc-orange)' }}>**</span> When you have trouble
												breathing and you cannot get enough air into your lungs. Often accompanied
												by chest tightness, breathlessness or a feeling of suffocation
											</p>
										</StepContent>
									)}
									{this.state.activeStep === 1 && (
										<StepContent>
											<div className='row'>
												<p>Select any of the following statements that apply to you:</p>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.worse}
													labelComponent='My symptoms are rapidly worsening'
													onChange={worse => this.setState({ worse })}
												/>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.breathing_fast}
													labelComponent={
														<span>
															My breathing is very fast
															<span style={{ color: 'var(--doc-orange)' }}>*</span>
														</span>
													}
													onChange={breathing_fast => this.setState({ breathing_fast })}
												/>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.cough_blood}
													labelComponent={
														<span>When I cough there are specks&nbsp;/&nbsp;droplets of blood</span>
													}
													onChange={cough_blood => this.setState({ cough_blood })}
												/>
											</div>
											<div className='row'>
												<DocButton
													text='Back'
													onClick={this.backStep}
													flat
													style={{ marginRight: '50px' }}
												/>
												<DocButton text='Next' onClick={this.nextStep} color='green' />
											</div>
											<p>
												<span style={{ color: 'var(--doc-orange)' }}>*</span> Breathing more than 20
												breaths in one minute.
											</p>
										</StepContent>
									)}
									{this.state.activeStep === 2 && (
										<StepContent>
											<div className='row'>
												<p>Select any of the following statements that apply to you:</p>
											</div>
											{this.state.symptom_options.map((symptom, i) => (
												<div className='row' key={i}>
													<MaterialCheckbox
														value={
															typeof this.state.symptoms.find(item => item === symptom.id) !==
															'undefined'
														}
														labelComponent={symptom.name}
														onChange={value => this.updateSymptoms(symptom.id, value)}
													/>
												</div>
											))}
											<div className='row'>
												<DocButton
													text='Back'
													onClick={this.backStep}
													flat
													style={{ marginRight: '50px' }}
												/>
												<DocButton text='Next' onClick={this.nextStep} color='green' />
											</div>
										</StepContent>
									)}
									{this.state.activeStep === 3 && (
										<StepContent>
											<div className='row'>
												<p>
													Have you had close contact with a person with confirmed or probable
													COVID-19 in the past 14 day? Please select all applicable options.
												</p>
											</div>
											{this.state.social_contact_options.map((option, i) => (
												<div className='row' key={i}>
													<MaterialCheckbox
														value={
															typeof this.state.social_contact.find(item => item === option.id) !==
															'undefined'
														}
														labelComponent={option.name}
														onChange={value => this.updateSocialContacts(option.id, value)}
													/>
												</div>
											))}
											<div className='row'>
												<h4>Family Travels</h4>
											</div>
											<div className='row'>
												<MaterialCheckbox
													value={this.state.high_risk_country}
													labelComponent='I or family members of mine have recently travelled to any of the high COVID-19 risk countries'
													onChange={high_risk_country => this.setState({ high_risk_country })}
												/>
											</div>
											<div className='row'>
												<LinkButton
													text={
														<span style={{ color: 'var(--doc-pink)' }}>
															Click here to see a list of countries and their risk status'
														</span>
													}
													linkSrc='https://www.cdc.gov/coronavirus/2019-ncov/travelers/map-and-travel-notices.html'
													color='pink'
													newTab
													flat
												/>
											</div>
											<div className='row'>
												<DocButton
													text='Back'
													onClick={this.backStep}
													flat
													style={{ marginRight: '50px' }}
												/>
												<DocButton text='Next' onClick={this.nextStep} color='green' />
											</div>
										</StepContent>
									)}
									{this.state.activeStep === 4 && (
										<StepContent>
											<p
												style={
													typeof this.state.code !== 'undefined'
														? this.state.code === 'RED'
															? { color: 'var(--doc-pink)' }
															: this.state.code === 'ORANGE'
															? { color: 'var(--doc-orange)' }
															: {}
														: {}
												}
											>
												{this.state.resultText}
											</p>
											<div className='row center'>
												<LinkButton
													text='My Results'
													color='green'
													linkSrc='/patient/test-results'
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
	}
}
