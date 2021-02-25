import React, { useState, useEffect } from 'react';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import './BookingEngine.scss';
import { Stepper, Step, StepLabel, StepContent, makeStyles } from '@material-ui/core';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import DocButton from '../DocButton/DocButton';
import bookingService from '../../services/bookingService';
import { ddMMyyyy } from '../../helpers/formatDate';

const useStyles = makeStyles({
	activeStep: {
		fontWeight: 'bold',
	},
});

const BookingEngine = ({ role, token, user }) => {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [selectedDate, setSelectedDate] = useState();
	const [selectedAppointment, setSelectedAppointment] = useState();
	const [appointments, setAppointments] = useState();
	const [availableDates, setAvailableDates] = useState();
	const [displayError, setDisplayError] = useState();
	const today = new Date();
	let in40days = new Date();
	in40days.setDate(today.getDate() + 40);
	const dateRange = {
		start: `${('0' + today.getDate()).slice(-2)}-${('0' + today.getMonth()).slice(-2)}-${today.getFullYear()}`,
		end: `${('0' + in40days.getDate()).slice(-2)}-${('0' + (in40days.getMonth() +1 )).slice(-2)}-${in40days.getFullYear()}`,
	};
	const steps = ['Select Date and Time', 'Appointment Summary', 'Booking Confirmation'];
	useEffect(() => {
		if (availableDates === null || typeof availableDates === 'undefined') {
			// get available days
			getAvailableDates();
		}
	}, []);
	useEffect(() => {
		if (selectedDate) {
			getSlots();
		}
	}, [selectedDate, setSelectedDate]);
	function getSlots() {
		bookingService
			.getSlots(typeof selectedDate === 'undefined' ? new Date() : selectedDate)
			.then(result => {
				if (result.success && result.appointments) {
					setAppointments(result.appointments);
				} else {
					// handle
				}
			})
			.catch(err => console.log(err));
	}
	function getAvailableDates() {
		bookingService
			.getAvailableDates(dateRange.start, dateRange.end, token)
			.then(result => {
				if (result.success && result.availableDates) {
					setAvailableDates(result.availableDates);
					const firstAvailableDate = result.availableDates.find(({ has_appointments }) => has_appointments);
					setSelectedDate(!!firstAvailableDate && !!firstAvailableDate.date ? firstAvailableDate.date : null);
				} else {
					// handle
				}
			})
			.catch(err => console.log(err));
	}
	function placeBooking() {
		const body = {
			billing_details: {
				first_name: user.first_name,
				last_name: user.last_name,
				dateOfBirth: ddMMyyyy(user.date_of_birth),
				email: user.email,
				street_address: user.address_1,
				extended_address: '',
				locality: user.city,
				region: user.county,
				postal_code: user.postcode,
			},
			toc_accept: true,
			marketing_accept: false,
		};

		bookingService
			.paymentRequest(selectedAppointment.id, body, token)
			.then(result => {
				if (result.success && result.confirmation) {
					handleNext();
				} else {
					setDisplayError(true);
					handleNext();
				}
			})
			.catch(() => {
				setDisplayError(true);
				handleNext();
			});
	}
	function handleBack() {
		setActiveStep(activeStep - 1);
	}
	function handleNext() {
		setActiveStep(activeStep + 1);
	}
	function updateDate(date) {
		setSelectedDate(date);
		setSelectedAppointment();
	}
	function updateSlot(slot_id) {
		const selected = appointments.filter(item => item.id === slot_id);
		setSelectedAppointment(selected[0]);
	}
	function renderSteps() {
		switch (activeStep) {
			case 0:
				return (
					<Step1
						appointments={appointments}
						availableDates={availableDates}
						selectedSlot={selectedAppointment}
						updateSlot={updateSlot}
						date={selectedDate}
						updateDate={updateDate}
					/>
				);

			case 1:
				return (
					<Step2
						start_time={selectedAppointment.start_time}
						end_time={selectedAppointment.end_time}
					/>
				);
			case 2:
				return (
					<Step3
						email={
							typeof user !== 'undefined' && user !== null && typeof user.email !== 'undefined'
								? user.email
								: 'undefined'
						}
						start_time={selectedAppointment.start_time}
						end_time={selectedAppointment.end_time}
						role={role}
						isError={displayError}
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
							{console.log(label, activeStep, i)}
							<StepLabel
								classes={{ active: classes.activeStep, root: classes.activeStep }}
								style={{ fontWeight: activeStep === i ? 'bold' : 500 }}
							>
								{label}
							</StepLabel>
							<StepContent>
								{renderSteps()}
								<div className='row flex-start'>
									{activeStep > 0 && activeStep < 2 && (
										<DocButton
											flat
											text='Back'
											onClick={handleBack}
											style={{ marginRight: '20px' }}
										/>
									)}
									{activeStep === 0 && typeof selectedAppointment !== 'undefined' && (
										<DocButton
											text='Confirm'
											color='green'
											onClick={handleNext}
											disabled={!selectedAppointment}
										/>
									)}
									{activeStep === 1 && typeof selectedAppointment !== 'undefined' && (
										<DocButton color='green' text='Confirm' onClick={placeBooking} />
									)}
									{displayError && activeStep === 2 && (
										<DocButton
											text='Back'
											color='pink'
											onClick={handleBack}
											style={{ marginRight: '20px' }}
										/>
									)}
								</div>
							</StepContent>
						</Step>
					))}
				</Stepper>
			</BigWhiteContainer>
		</React.Fragment>
	);
};

export default BookingEngine;
