import React from 'react';
import { useFormikContext } from 'formik';
import { ddMMyyyy, formatTimeSlotWithTimeZone } from '../../helpers/formatDate';
import { PRODUCTS_WITH_ADDITIONAL_INFO, FIT_TO_FLY_PCR } from '../../helpers/productsWithAdditionalInfo';
import './BookingEngine.scss';

const icon = require('../../assets/images/icons/circled-tick.svg');

const Step5 = ({ isBookingSkip, defaultTimezone }) => {
    const {
        values: {
            appointmentDate,
            selectedSlot,
            passengers,
            timezone: timezoneValue,
            testType: {
                sku,
                title,
            },
        },
    } = useFormikContext();
    const isPCR = sku === FIT_TO_FLY_PCR;
	const isBundle = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
	const timezone = (isBundle || isPCR) ? defaultTimezone.timezone : timezoneValue;

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
                                <strong>Selected Product:&nbsp;</strong>
                                {title}
                            </p>
                        </div>
                        {!isBookingSkip && (
                            <>
                                <div className='row no-margin'>
                                    <p>
                                        <strong>Selected Date:&nbsp;</strong>
                                        {ddMMyyyy(appointmentDate)}
                                    </p>
                                </div>
                                <div className='row no-margin'>
                                    <p>
                                        <strong>Selected Time:&nbsp;</strong>
                                        {formatTimeSlotWithTimeZone(selectedSlot.start_time, timezone)} - {formatTimeSlotWithTimeZone(selectedSlot.end_time, timezone)} ({timezone})
                                    </p>
                                </div>
                            </>
                        )}
                        <div className='row no-margin'>
                            <p><strong>
                                A confirmation email will be sent to: {passengers[0].email}
                            </strong></p>
                        </div>
					    <div className='row no-margin '>
                            <p className="red-bold-text">
                                Please check your spam folder.
                            </p>
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
