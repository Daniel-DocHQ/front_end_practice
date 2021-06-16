import React from 'react';
import { Form, useFormikContext } from 'formik';
import { Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import './BookingEngine.scss';

const BookingEngineForm = ({
    activePassenger,
    activeStep,
    handleBack,
    steps,
    items,
    defaultCountryCode,
    defaultTimezone,
    bookingUsersQuantity = 0,
    isEdit = false,
    status,
    dropTimer,
    timer,
    isBookingSkip = false,
    totalAvailableQuantity = 0,
    ...restProps
}) => {
    const isLastStep = activeStep === steps.length - 1;
    const { values: { numberOfPeople }} = useFormikContext();

    const stepsComponents = [
        <Step0
            items={items}
            isEdit={isEdit}
            bookingUsersQuantity={bookingUsersQuantity}
        />,
        <Step1 />,
        ...(isBookingSkip ? [] : [
            <Step2
                defaultTimezone={defaultTimezone}
                dropTimer={dropTimer}
                timer={timer}
            />,
        ]),
        <Step3
            activePassenger={activePassenger}
            defaultCountryCode={defaultCountryCode}
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
                                            text='Back to Home'
                                            color='green'
                                            linkSrc={isEdit ? '/customer_services/dashboard' : process.env.REACT_APP_WEBSITE_LINK}
                                        />
                                        {(totalAvailableQuantity > numberOfPeople && !isEdit) && (
                                            <DocButton
                                                style={{ marginLeft: 10 }}
                                                text='Book one more Appointment'
                                                color='green'
                                                onClick={() => window.location.reload()}
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

export default BookingEngineForm;
