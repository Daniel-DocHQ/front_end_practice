import React from 'react';
import { Form, useFormikContext } from 'formik';
import { Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import LufthansaStep0 from './LufthansaStep0';
import './BookingEngine.scss';

const LufthansaBookingEngineForm = ({
    activePassenger,
    activeStep,
    handleBack,
    steps,
    items,
    defaultTimezone,
    bookingUsersQuantity = 0,
    isEdit = false,
    status,
    dropTimer,
    timer,
    products,
    createdAppointmentId,
    isPharmacy = false,
    isBookingSkip = false,
    totalAvailableQuantity = 0,
    ...restProps
}) => {
    const isLastStep = activeStep === steps.length - 1;
    const { values: { numberOfPeople } } = useFormikContext();

    const stepsComponents = [
        <Step1 isPharmacy />,
        <LufthansaStep0 products={products} />,
        <Step2
            isEuro
            isEdit={isEdit}
            defaultTimezone={defaultTimezone}
            isPharmacy={isPharmacy}
            dropTimer={dropTimer}
            timer={timer}
        />,
        <Step3
            isLufthansa
            activePassenger={activePassenger}
            isPharmacy={isPharmacy}
            isEdit={isEdit}
        />,
        <Step4
            isBookingSkip={isBookingSkip}
            status={status}
            defaultTimezone={defaultTimezone}
        />,
        <Step5
            isBookingSkip={isBookingSkip}
            defaultTimezone={defaultTimezone}
        />,
    ];

	return (
        <Form {...restProps}>
            <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((label, i) => (
                    <Step key={label}>
                        <StepLabel>{label}{(steps[activeStep] === 'Passenger Details' && i === activeStep) && ` ${activePassenger + 1}`}</StepLabel>
                        <StepContent>
                            {stepsComponents[activeStep]}
                            <div className='row flex-start'>
                                {(activeStep > 0 && steps[activeStep] !== 'Booking Confirmation') && (
                                    <DocButton
                                        flat
                                        text='Back'
                                        color="grey"
                                        onClick={handleBack}
                                        style={{ marginRight: '20px' }}
                                    />
                                )}
                                {isLastStep ? (
                                    <>
                                        <LinkButton
                                            text={isBookingSkip ? 'Register your kit' : 'Back to Home'}
                                            color='green'
                                            linkSrc={isBookingSkip ? `/register-kit/${createdAppointmentId}` : isEdit ? '/customer_services/dashboard' : process.env.REACT_APP_WEBSITE_LINK}
                                        />
                                        {(totalAvailableQuantity > numberOfPeople && !isEdit) && (
                                            <DocButton
                                                style={{ marginLeft: 10 }}
                                                text='Book next appointment'
                                                color='green'
                                                onClick={() => {
                                                    if (typeof window !== 'undefined') window.location.reload();
                                                }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <DocButton
                                        text='Confirm'
                                        color='green'
                                        type="submit"
                                    />
                                )}
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Form>
	);
};

export default LufthansaBookingEngineForm;
