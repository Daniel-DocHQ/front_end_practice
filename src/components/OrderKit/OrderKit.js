import React, { useContext, useState } from 'react';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import { Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import { DocCalendarSpecial } from '../FormComponents/DocCalendar/DocCalendar';
import { formatOrderDate } from '../../helpers/formatDate';
import DocButton from '../DocButton/DocButton';
import DocAlertBox from '../DocAlertBox/DocAlertBox';
import bookingUserDataService from '../../services/bookingUserDataService';
import { addDays } from 'date-fns';
import LinkButton from '../DocButton/LinkButton';
import { AuthContext } from '../../context/AuthContext';

const tick = require('../../assets/images/icons/circled-tick.svg');

const OrderKit = () => {
	const { role_profile, token, user, role } = useContext(AuthContext);
	const [activeStep, setActiveStep] = useState(0);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isSuccessful, setIsSuccessful] = useState();
	const [userSetDate, setUserSetDate] = useState(false);
	const steps = ['Select Appointment Date', 'Confirmation'];
	console.log(selectedDate);

	function placeOrder() {
		if (selectedDate && role_profile && role_profile.id && token) {
			// date is in future, do stuffs
			const body = {
				role_profile_id: role_profile.id,
				appointment_date: Math.floor(
					new Date(new Date(selectedDate).toUTCString()).getTime() / 1000
				),
			};
			bookingUserDataService
				.orderKit(token, body)
				.then(result => {
					setIsSuccessful(result.success);
					setActiveStep(1);
				})
				.catch(() => {
					setIsSuccessful(false);
					setActiveStep(1);
				});
		}
	}

	function renderSteps() {
		switch (activeStep) {
			case 0:
				return (
					<Step1
						date={selectedDate}
						updateDate={setSelectedDate}
						confirm={placeOrder}
						userSetDate={userSetDate}
					/>
				);
			case 1:
				return (
					<Step2
						isSuccessful={isSuccessful}
						email={user.email}
						errorMessage={'An error occurred, please try again'}
						back={() => setActiveStep(0)}
						role={role}
					/>
				);
		}
	}
	return (
		<React.Fragment>
			<BigWhiteContainer>
				<Stepper activeStep={activeStep} orientation='vertical'>
					{steps.map((label, i) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
							<StepContent>{renderSteps()}</StepContent>
						</Step>
					))}
				</Stepper>
			</BigWhiteContainer>
		</React.Fragment>
	);
};

export default OrderKit;

const Step1 = ({ date, updateDate, confirm }) => (
	<div>
		<div className='row no-margin'>
			<p>Please select your Vista Health appointment date</p>
		</div>
		<div className='row no-margin'>
			<div
				className='col no-margin'
				style={{ width: '30px', color: 'var(--doc-dark-grey)', opacity: '0.6' }}
			>
				<i className='fa fa-info-circle'></i>
			</div>
			<p style={{ color: 'var(--doc-dark-grey)', opacity: '0.6' }}>
				You can only order your Home Test Kit at least 8 working days before your Vista Health
				appointment.
				<br></br>
				Please call your clinic should you need to reschedule your appointment.
			</p>
		</div>
		<div className='row'>
			<DocCalendarSpecial
				label='Select Date'
				date={date}
				updateDate={updateDate}
				shouldDisableDates={true}
			/>
		</div>

		<div className='row'>
			<p className='no-margin'>
				Is this your Vista Health appointment date?<br></br>
				<br></br>
				<span style={{ fontWeight: '700' }}>{formatOrderDate(date)}</span>
			</p>
		</div>
		<div className='row flex-end' style={{ maxWidth: '400px' }}>
			<DocButton text='Confirm' color='green' onClick={confirm} />
		</div>
	</div>
);

const Step2 = ({ isSuccessful, email, errorMessage, back, role }) =>
	isSuccessful ? (
		<React.Fragment>
			<div className='row flex-start' style={{ alignItems: 'flex-start', maxWidth: '500px' }}>
				<img src={tick} alt='dochq logo' style={{ maxHeight: '64px', paddingRight: '24px' }} />
				<div>
					<h4 className='no-margin'>Thank you, your kit is on the way.</h4>
					<p>
                        A confirmation email will be sent to:{' '}
                        <span style={{ fontWeight: '700' }}>{email}</span><br /><br />
                        Please, book your online video appointment with the health care professional that will guide you through the test.
                    </p>
				</div>
			</div>
			<div className='row flex-end' style={{ maxWidth: '500px' }}>
				<LinkButton text='Back to Home' color='green' linkSrc={`/${role}/dashboard`} />
			</div>
		</React.Fragment>
	) : (
		<React.Fragment>
			<DocAlertBox
				status='error'
				message={errorMessage}
				isClosable={true}
				style={{ maxWidth: '400px' }}
			/>
			<div className='row flex-end' style={{ maxWidth: '400px' }}>
				<DocButton text='Back' color='dark-grey' flat onClick={back} />
			</div>
		</React.Fragment>
	);
