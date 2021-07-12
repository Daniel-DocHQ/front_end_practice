import React from 'react';
import { useFormikContext } from 'formik';
import { Divider } from '@material-ui/core';
import { ddMMyyyy, formatTimeSlotWithTimeZone } from '../../helpers/formatDate';
import { PRODUCTS_WITH_ADDITIONAL_INFO, FIT_TO_FLY_PCR } from '../../helpers/productsWithAdditionalInfo';
import './BookingEngine.scss';

const Summary = ({ defaultTimezone, activeStep }) => {
    const {
        values: {
            testType: {
                sku,
                title,
            },
            appointmentDate,
            numberOfPeople,
            timezone: timezoneValue,
            selectedSlot,
            passengers,
        },
    } = useFormikContext();
    const isPCR = sku === FIT_TO_FLY_PCR;
	const isBundle = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
	const timezone = (isBundle || isPCR) ? defaultTimezone.timezone : timezoneValue;

	return (
        <div className="summary-box">
            <h2 className="green-text title-text" style={{ margin: 0 }}>
                <i class="far fa-check-circle " style={{ marginRight: 7 }} />Your Booking
            </h2>
            <Divider className="divider" style={{ marginTop: 16, width: '65%' }} />
            {(!!title && activeStep > 0) && (
                <div className='row no-margin'>
                    <p>
                        <strong>Selected Test:&nbsp;</strong>
                        {title}
                    </p>
                </div>
            )}
            {(numberOfPeople && activeStep > 0) && (
                <div className='row no-margin'>
                    <p>
                        <strong>People attending:&nbsp;</strong>
                        {numberOfPeople}
                    </p>
                </div>
            )}
            {!!selectedSlot && (
                <>
                    <div className='row no-margin'>
                        <p>
                            <strong>Appointment Date:&nbsp;</strong>
                            {ddMMyyyy(appointmentDate)}
                        </p>
                    </div>
                    <div className='row no-margin'>
                        <p>
                            <strong>Appointment Time:&nbsp;</strong>
                            {formatTimeSlotWithTimeZone(selectedSlot.start_time, timezone)} - {formatTimeSlotWithTimeZone(selectedSlot.end_time, timezone)} ({timezone})
                        </p>
                    </div>
                </>
            )}
            {(!!passengers.length && activeStep > 2) && (
                <div className='row no-margin'>
                    <p>
                        <strong>People attending:&nbsp;</strong>
                        {passengers.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')}
                    </p>
                </div>
            )}
        </div>
	);
};

export default Summary;
