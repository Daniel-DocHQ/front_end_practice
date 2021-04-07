import React from 'react';
import { Form } from 'formik';
import './BookingEngine.scss';
import { Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';

const BookingEngineForm = ({ activeStep, handleBack, steps, ...restProps }) => {
    const isLastStep = activeStep === steps.length - 1;
	function renderSteps() {
		switch (activeStep) {
            case 0:
				return (
					<Step0 />
				);
			case 1:
				return (
					<Step1 />
				);

			case 2:
				return (
					<Step2 />
				);
			case 3:
				return (
					<Step3 />
				);
            case 4:
				return (
					<Step4 />
				);
            case 5:
				return (
					<Step5 />
				);
		}
	}
	return (
        <Form {...restProps}>
            <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((label, i) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {renderSteps()}
                            <div className='row flex-start'>
                                {activeStep > 0 && activeStep < 5 && (
                                    <DocButton
                                        flat
                                        text='Back'
                                        onClick={handleBack}
                                        style={{ marginRight: '20px' }}
                                    />
                                )}
                                {isLastStep ? (
                                    <LinkButton
                                        text='Back to Home'
                                        color='green'
                                        linkSrc={`b2c/dashboard`}
                                    />
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
