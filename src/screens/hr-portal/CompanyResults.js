import React, { Component } from 'react';
import { ToastsStore } from 'react-toasts';
import DocAccordion from '../../components/DocAccordion';
import HRTable from '../../components/HRTable';
import bookingUserDataService from '../../services/bookingUserDataService';
const data = [
	{
		title: 'Understanding your RT-PCR test results',
		content: (
			<React.Fragment>
				<h4>
					<i className='fa fa-check' style={{ color: 'var(--doc-green)' }}></i>
					&nbsp;&nbsp;Positive
				</h4>
				<p>
					The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis indicates
					that genetic material from SARS-CoV-2 was found in the test sample and the individual has
					confirmed coronavirus disease.
				</p>
				<div className='separator'></div>
				<h4>
					<i className='fa fa-times' style={{ color: 'var(--doc-pink)' }}></i>
					&nbsp;&nbsp;Negative
				</h4>
				<p>
					The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis indicates
					that no genetic material from SARS-CoV-2 was not found in the test sample, the individual
					does not have coronavirus disease.
				</p>
			</React.Fragment>
		),
	},
	{
		title: 'What do I do if my RT-PCR test result is negative?',
		content: (
			<React.Fragment>
				<p>You do not need to self-isolate if your test is negative, as long as:</p>
				<ul>
					<li>everyone you live with who has symptoms tests negative</li>
					<li>everyone in your support bubble who has symptoms tests negative</li>
					<li>
						you were not told to self-isolate for 14 days by NHS Test and Trace – if you were, see
						what to do if you've been told you've been in contact with someone who has coronavirus
					</li>
					<li>you feel well – if you feel unwell, stay at home until you’re feeling better</li>
					<li>
						If you have diarrhea or you’re being sick, stay at home until 48 hours after they've
						stopped
					</li>
				</ul>
			</React.Fragment>
		),
	},
	{
		title: 'What do I do if my RT-PCR test result is positive?',
		content: (
			<React.Fragment>
				<p>
					If your test is positive, you must self-isolate immediately.
					<br></br>
					<br></br>
					If you had a test because you had symptoms, keep self-isolating for at least 10 days from
					when your symptoms started.
					<br></br>
					<br></br>
					If you had a test but have not had symptoms, self-isolate for 10 days from when you had
					the test.
					<br></br>
					<br></br>
					Anyone you live with, and anyone in your support bubble, must self-isolate for 14 days
					from when you start self-isolating.
				</p>
			</React.Fragment>
		),
	},
];
export default class CompanyResults extends Component {
	constructor(props) {
		super(props);

		this.state = {
			symptom_history: [],
		};
		this.getCompanyResults = getCompanyResults.bind(this);

		function getCompanyResults() {
			bookingUserDataService
				.getHRData(this.props.token)
				.then(result => {
					if (result.success && result.symptom_history) {
						this.setState({ symptom_history: result.symptom_history });
					} else {
						ToastsStore.error('Error fetching results');
					}
				})
				.catch(err => ToastsStore.error('Error fetching results'));
		}
	}

	componentDidMount() {
		this.getCompanyResults();
	}
	render() {
		return (
			<React.Fragment>
				<div className='row center'>
					<h2>Help</h2>
				</div>
				<div style={{ width: '1200px', maxWidth: '95%', margin: 'auto' }}>
					{data.map((item, i) => (
						<DocAccordion key={i} content={item.content} title={item.title} />
					))}
				</div>

				<HRTable
					symptom_history={this.state.symptom_history.length > 0 ? this.state.symptom_history : []}
				/>
			</React.Fragment>
		);
	}
}
