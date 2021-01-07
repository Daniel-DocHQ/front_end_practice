import { Paper, TableCell, TableHead, TableRow, Table, TableContainer } from '@material-ui/core';
import React, { memo, useEffect, useState, useContext } from 'react';
import DocButton from '../../components/DocButton/DocButton';
import firstCharUpper from '../../helpers/firstCharUpper';
import DocModal from '../../components/DocModal/DocModal';
import bookingUserDataService from '../../services/bookingUserDataService';
import { ToastsStore } from 'react-toasts';
import LinkButton from '../../components/DocButton/LinkButton';
import ResultsGuide from '../../components/ResultsGuide/ResultsGuide';
import DocAccordion from '../../components/DocAccordion';
import { AuthContext } from '../../context/AuthContext';
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
const TestResults = props => {
	const { role_profile, setRoleProfile, token, organisation_profile } = useContext(AuthContext);
	const [isVisible, setIsVisible] = useState();
	const [resultToDisplay, setResultToDisplay] = useState();
	const [symptomResults, setSymptomResults] = useState();
	const [gotSymptomResults, setGotSymptomResults] = useState(false);
	const [testResults, setTestResults] = useState();
	const [gotTestResults, setGotTestResults] = useState(false);

	useEffect(() => {
		if (!gotSymptomResults && typeof symptomResults === 'undefined') {
			getSymptomResults();
		}
	}, [gotSymptomResults, setGotSymptomResults]);

	useEffect(() => {
		if (!gotTestResults && typeof testResults === 'undefined') {
			getTestResults();
		}
	}, [gotTestResults, setGotTestResults]);

	function getSymptomResults() {
		bookingUserDataService
			.getMyHistory(props.token)
			.then(result => {
				if (result.success && result.symptom_history) {
					setGotSymptomResults(true);
					setSymptomResults(result.symptom_history);
					//ToastsStore.success(`Found ${result.symptom_history.length} results`);
				}
				// else {
				// 	//ToastsStore.error('Error fetching results');
				// }
			})
			.catch(err => ToastsStore.error('Error fetching results'));
	}
	function getTestResults() {
		bookingUserDataService
			.getTestResultHistory(props.token, props.role_profile.id)
			.then(result => {
				if (result.success && result.test_results) {
					setGotTestResults(true);
					setTestResults(result.test_results);
					//ToastsStore.success(`Found ${result.test_results.length} results`);
				}
				// else {
				// 	//ToastsStore.error('Error fetching results');
				// }
			})
			.catch(err => ToastsStore.error('Error fetching results'));
	}
	return (
		<React.Fragment>
			{typeof resultToDisplay !== 'undefined' && (
				<DocModal
					isVisible={isVisible}
					onClose={() => {
						setIsVisible(false);
						setResultToDisplay(null);
					}}
					content={<ModalContent result={resultToDisplay} />}
					title={`Results for: ${new Date(resultToDisplay.created_at).toLocaleDateString()}`}
				/>
			)}
			<div className='row center'>
				<h2>Help</h2>
			</div>
			<div style={{ width: '1200px', maxWidth: '95%', margin: 'auto' }}>
				{data.map((item, i) => (
					<DocAccordion key={i} content={item.content} title={item.title} />
				))}
			</div>
			<div className='row no-margin center' style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {typeof organisation_profile !== 'undefined' && organisation_profile !== null && organisation_profile.daily_check === true && (
				<Paper style={{ width: '400px', maxWidth: '95%', margin: '20px', padding: '15px' }}>
					<div className='row'>
						<h2>Symptom Checker Results</h2>
					</div>
					<TableContainer>
						<Table stickyHeader>
							<TableHead>
								<TableRow key={'table-head'}>
									<TableCell>Check Date</TableCell>
									<TableCell>Symptomatic</TableCell>
								</TableRow>
							</TableHead>
							{typeof symptomResults !== 'undefined' && symptomResults.length > 0 ? (
								symptomResults.map((result, i) => (
									<TableRow key={i}>
										<TableCell>{new Date(result.created_at * 1000).toLocaleDateString()}</TableCell>
										<TableCell>{firstCharUpper(result.symptomatic.toString())}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell>No results to display</TableCell>
								</TableRow>
							)}
						</Table>
					</TableContainer>
				</Paper>
                )}
				<Paper
					style={{
						width: '400px',
						maxWidth: '95%',
						margin: '20px',
						padding: '15px',
						boxSizing: 'border-box',
						overflowY: 'scroll',
					}}
				>
					<div className='row'>
						<h2>Test Results</h2>
					</div>
					<TableContainer>
						<Table stickyHeader>
							<TableHead>
								<TableRow key={'table-head'}>
									<TableCell>Test Date</TableCell>
									<TableCell>Result</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							{typeof testResults !== 'undefined' && testResults.length > 0 ? (
								testResults.map((result, i) => (
									<TableRow key={i}>
										<TableCell>
											{new Date(result.sample_date * 1000).toLocaleDateString()}
										</TableCell>
										<TableCell>{firstCharUpper(result.result.toString())}</TableCell>
										<TableCell>
											{result.status !== 'Pending' && result.file_url ? (
												<LinkButton text='Open' newTab linkSrc={result.file_url} color='pink' />
											) : (
												'Pending'
											)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell>No results to display</TableCell>
								</TableRow>
							)}
						</Table>
					</TableContainer>
				</Paper>
			</div>
		</React.Fragment>
	);
};

export default memo(TestResults);

const ModalContent = ({ result }) => (
	<React.Fragment>
		<div className='col' style={{ maxWidth: '300px' }}>
			<div className='row space-between'>
				<span>Symptomatic:</span>
				<span>{firstCharUpper(result.symptomatic.toString())}</span>
			</div>
			<div className='row space-between'>
				<span>Fever:</span>
				<span>{firstCharUpper(result.fever.toString())}</span>
			</div>
			<div className='row space-between'>
				<span>Coughing Blood:</span>
				<span>{firstCharUpper(result.coughing_blood.toString())}</span>
			</div>
			<div className='row space-between'>
				<span>Shortness of Breath:</span>
				<span>{firstCharUpper(result.shortness_of_breath.toString())}</span>
			</div>
			<div className='row space-between'>
				<span>Viral Contact:</span>
				<span>{firstCharUpper(result.contact_name)}</span>
			</div>
		</div>
	</React.Fragment>
);
