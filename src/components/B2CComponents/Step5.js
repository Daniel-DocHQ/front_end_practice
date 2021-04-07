import React from 'react';
import { useFormikContext } from 'formik';
import { ddMMyyyy, formatTimeSlot } from '../../helpers/formatDate';
import LinkButton from '../DocButton/LinkButton';
import './BookingEngine.scss';

const icon = require('../../assets/images/icons/circled-tick.svg');

const Step5 = () => {
    const { values: { appointmentDate, selectedSlot, email } } = useFormikContext();

    return (
        typeof isError === 'undefined' ? (
            <React.Fragment>
                <div className='confirmation-container'>
                    <div className='tick'>
                        <img src={icon} alt='Success' />
                    </div>
                    <div>
                        <div className='row no-margin'>
                            <h3 className='no-margin'>Your Appointment Has Been Booked</h3>
                        </div>
                        <div className='row no-margin'>
                            <p>
                                <strong>Selected Date:&nbsp;</strong>
                                {ddMMyyyy(appointmentDate)}
                            </p>
                        </div>
                        <div className='row no-margin'>
                            <p>
                                <strong>Selected Time:&nbsp;</strong>
                                {formatTimeSlot(selectedSlot)} - {formatTimeSlot(selectedSlot)}
                            </p>
                        </div>
                        <div className='row no-margin'>
                            <p>A confirmation email will be sent to: {email}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <h2>An error occurred please try again</h2>
            </React.Fragment>
        )
    );
};

export default Step5;
