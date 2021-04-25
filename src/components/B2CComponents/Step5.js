import React from 'react';
import { useFormikContext } from 'formik';
import { ddMMyyyy, formatTimeSlot } from '../../helpers/formatDate';
import './BookingEngine.scss';

const icon = require('../../assets/images/icons/circled-tick.svg');

const Step5 = ({ passengers }) => {
    const { values: { appointmentDate, selectedSlot } } = useFormikContext();
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
                                {formatTimeSlot(selectedSlot.start_time)} - {formatTimeSlot(selectedSlot.end_time)}
                            </p>
                        </div>
                        <div className='row no-margin'>
                            <p>A confirmation email will be sent to: {passengers[0].email}</p>
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
