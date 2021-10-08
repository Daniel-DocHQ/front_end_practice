import React, { memo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
} from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import { get, startCase } from 'lodash';
import { format } from 'date-fns';
import DocButton from '../DocButton/DocButton';
import getURLParams from '../../helpers/getURLParams';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import nurseSvc from '../../services/nurseService';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import AppointmentNotes from './AppointmentNotes';
import './AppointmentView.scss';

const AppointmentView = (props) => {
    const timezone = get(Intl.DateTimeFormat().resolvedOptions(), 'timeZone', 'local time');
    const [appointment, setAppointment] = useState();
    const [loading, setLoading] = useState(false);
    const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
    const patients = get(appointment, 'booking_users', []);
    const notes = get(appointment, 'notes', []);
    const statusChanges = get(appointment, 'status_changes', []) || [];
    let history = useHistory();

    if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}
    const getAppointmentDetails = async (appointmentId, token) => {
        setLoading(true);
        await nurseSvc
            .getAppointmentDetails(appointmentId, token)
            .then(result => {
                if (result.success && result.appointment) {
                    setAppointment(result.appointment);
                } else {
                    ToastsStore.error(`Cannot find appointment details`);
                }
            })
            .catch(() => ToastsStore.error(`Cannot find appointment details`))
        setLoading(false);
    };

    useEffect(() => {
        if (appointmentId) {
            getAppointmentDetails(appointmentId, props.token)
        }
    }, []);

    if (loading && !appointment) {
		return (
			<BigWhiteContainer>
				<div className='row center'>
					<LoadingSpinner />
				</div>
			</BigWhiteContainer>
		);
	}

	return (
        <BigWhiteContainer>
            {appointment && (
                <Box px={8} py={4}>
                    <Box pb={6}>
                        <Grid container justify="space-between">
                            <Grid item xs={3}>
                                <AppointmentInfo appointment={appointment} />
                            </Grid>
                            <Grid item xs={3}>
                                <AddressInfo appointment={appointment} />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box pb={6}>
                        <Grid container spacing={8}>
                            {patients.map((patient) => (
                                <Grid item xs={3}>
                                    <PatientInfo patient={patient} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <AppointmentNotes notes={notes} />
                    {!!statusChanges.length && (
                        <Box>
                            <Typography className="row-text"><b>Appointment Status Changes:</b></Typography>
                            {statusChanges.map(({ changed_to, created_at }, indx) => (
                                <Typography key={indx}>
                                    <b>{startCase(changed_to.replace('_', ' ').toLowerCase())}</b> - {format(new Date(created_at), 'dd/MM/yyyy pp')} ({timezone})
                                </Typography>
                            ))}
                        </Box>
                    )}
                    <Box display="flex" justifyContent="flex-end">
                        <DocButton
                            text='Send as email'
                            color='pink'
                        />
                        <DocButton
                            text='Download PDF'
                            color='pink'
                            style={{ marginLeft: 20 }}
                        />
                    </Box>
                </Box>
            )}
        </BigWhiteContainer>
	);
};

export default memo(AppointmentView);

const AppointmentInfo = ({ appointment }) => {
    const appointmentStartTime = new Date(get(appointment, 'start_time', undefined));
    const appointmentEndTime = new Date(get(appointment, 'end_time', undefined));

    return (
        <Box>
            <Typography className="row-text"><b>Appointment Date: </b>{appointmentStartTime.toLocaleDateString()}</Typography>
            <Typography className="row-text"><b>Appointment Time: </b>{format(appointmentStartTime, 'p')} - {format(appointmentEndTime, 'p')}</Typography>
            <Typography className="row-text"><b>Number of people: </b>{get(appointment, 'booking_users.length', '')}</Typography>
            <Box pt={2}>
                <Typography className="row-text"><b>Test Type: </b>{get(appointment, 'booking_user.metadata.test_type', '')}</Typography>
            </Box>
        </Box>
    );
};

const AddressInfo = ({ appointment }) => {
    const addressLine1 = get(appointment, 'booking_user.street_address', '');
    const addressLine2 = get(appointment, 'booking_user.extended_address', '');
    const city = get(appointment, 'booking_user.locality', '');
    const county = get(appointment, 'booking_user.region', '');
    const country = get(appointment, 'booking_user.country', '');
    const postalCode = get(appointment, 'booking_user.postal_code', '');

    return (
        <Box>
            {addressLine1 && (<Typography className="row-text"><b>Address Line 1: </b>{addressLine1}</Typography>)}
            {addressLine2 && (<Typography className="row-text"><b>Address Line 2: </b>{addressLine2}</Typography>)}
            {city && (<Typography className="row-text"><b>City: </b>{city}</Typography>)}
            {county && (<Typography className="row-text"><b>County: </b>{county}</Typography>)}
            {postalCode && (<Typography className="row-text"><b>Postcode: </b>{postalCode}</Typography>)}
            <Box pt={2}>
                {country && (<Typography className="row-text"><b>Country: </b>{country}</Typography>)}
            </Box>
        </Box>
    );
};

const PatientInfo = ({ patient }) => {
    const firstName = get(patient, 'metadata.first_name', '') || get(patient, 'first_name', '');
    const lastName = get(patient, 'metadata.last_name', '') || get(patient, 'last_name', '');
    const email = get(patient, 'metadata.email', '') || get(patient, 'email', '');
    const phone = get(patient, 'metadata.phone', '') || get(patient, 'phone', '');
    const date_of_birth = get(patient, 'date_of_birth', '') || get(patient, 'metadata.date_of_birth', '');
    const sex = get(patient, 'sex', '');
    const ethnicity = get(patient, 'ethnicity', '');
    const passportNumber = get(patient, 'metadata.passport_number', '') || get(patient, 'metadata.passportId', '');
    const result = get(patient, 'metadata.result', '');
    const rejectedNotes = get(patient, 'metadata.reject_notes', '');
    const invalidNotes = get(patient, 'metadata.invalid_notes', '');
    const sampleTaken = get(patient, 'metadata.sample_taken', '');
    const kitProvider = get(patient, 'metadata.kitProvider', '');
    const kitId = get(patient, 'metadata.kit_id', '');
    const samplingDate = get(patient, 'metadata.date_sampled', '') || get(patient, 'metadata.sample_date', '');
    const reportedDate = get(patient, 'metadata.date_reported', '');

    return (
        <Box>
            {firstName && (<Typography className="row-text"><b>Name: </b>{firstName}</Typography>)}
            {lastName && (<Typography className="row-text"><b>Surname: </b>{lastName}</Typography>)}
            {email && (<Typography className="row-text"><b>Email Address: </b>{email}</Typography>)}
            {phone && (<Typography className="row-text"><b>Phone Number: </b>{phone}</Typography>)}
            {date_of_birth && (<Typography className="row-text"><b>Date of Birth: </b>{format(new Date(date_of_birth), 'dd-MM-yyyy')}</Typography>)}
            {ethnicity && (<Typography className="row-text"><b>Ethnicity: </b>{ethnicity}</Typography>)}
            {sex && (<Typography className="row-text"><b>Sex: </b>{sex}</Typography>)}
            {passportNumber && (<Typography className="row-text"><b>ID Document Number: </b>{passportNumber}</Typography>)}
            {kitId && (<Typography className="row-text"><b>Kit ID: </b>{kitId}</Typography>)}
            {samplingDate && (<Typography className="row-text"><b>Sampling Date and Time: </b>{new Date(samplingDate).toUTCString()}</Typography>)}
            {reportedDate && (<Typography className="row-text"><b>Reported Date and Time: </b>{new Date(reportedDate).toUTCString()}</Typography>)}
            <Box pt={2}>
                {kitProvider && (
                    <Typography className="row-text">
                        <b>KIT provider: </b>{kitProvider}
                    </Typography>
                )}
                {sampleTaken && (
                    <Typography className="row-text">
                        <b>Sample: </b>
                        <span className={sampleTaken.toLowerCase()}>{sampleTaken}</span>
                    </Typography>
                )}
                {result && (
                    <Typography className="row-text">
                        <b>Test Result: </b>
                        <span className={result.toLowerCase()}>{result}</span>
                    </Typography>
                )}
                {rejectedNotes && (<Typography className="row-text"><b>Rejection Notes: </b>{rejectedNotes}</Typography>)}
                {invalidNotes && (<Typography className="row-text"><b>Invalid Notes: </b>{invalidNotes}</Typography>)}
            </Box>
        </Box>
    );
};


