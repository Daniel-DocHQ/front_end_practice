import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Box,
	Grid,
	Checkbox,
    makeStyles,
	Typography,
	FormControl,
	FormGroup,
	FormControlLabel,
} from '@material-ui/core';
import { get } from 'lodash';
import { format } from 'date-fns';
import { ToastsStore } from 'react-toasts';
import nurseSvc from '../../services/nurseService';
import getURLParams from '../../helpers/getURLParams';
import DocButton from '../../components/DocButton/DocButton';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import DocModal from '../../components/DocModal/DocModal';

const useStyles = makeStyles((theme) => ({
    container: {
        background: 'white',
		padding: theme.spacing(4),
        borderRightBottomRadius: 10,
        borderLeftBottomRadius: 10,
        boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.1)',
    },
	formControl: {
		margin: theme.spacing(3),
	},
	checkboxLabel: {
		fontWeight: 'bold',
	},
}));

const ShiftDetails = ({ isAuthenticated, role, token }) => {
	const [practitioner, setPractitioner] = useState({
		name: 'Silvia Valentini',
		start_time: '2021-04-13T07:00:00Z',
		end_time: '2021-04-13T11:00:00Z',
		email: 'silviavalentini@dochq.co.uk',
		phone: '0751234567890',
	});
	const [isVisible, setIsVisible] = useState(false);
	const [selectedAll, setSelectedAll] = useState(false);
	const params = getURLParams(window.location.href);
	const practitionerId = params['practitionerId'];
	const practitionerStartTime = new Date(get(practitioner, 'start_time', ''));
	const practitionerEndTime = new Date(get(practitioner, 'end_time', ''));
	let hourCounter = new Date(get(practitioner, 'start_time', ''));
	const [appointmentValues, setAppointmentValues] = useState([]);
	const shiftHours = Math.abs(practitionerStartTime.getTime() - practitionerEndTime.getTime()) / 3600000;
	const classes = useStyles();
	let counter = 0;
	let history = useHistory();

    if (isAuthenticated !== true && role !== 'practitioner') {
		history.push('/login');
	}

	const getPractitionerDetails = (practitionerId) => (
        nurseSvc
            .getPractitionerDetails(practitionerId, token)
            .then(result => {
                if (result.success && result.practitioner) {
                    setPractitioner(result.practitioner);
                } else {
                    ToastsStore.error(`Cannot find practitioner details`);
                }
            })
            .catch(() => ToastsStore.error(`Cannot find practitioner details`))
    );

    useEffect(() => {
        // if (practitionerId) {
        //     getPractitionerDetails(practitionerId)
        // }
    }, [practitionerId]);

	useEffect(() => {
		if (practitioner) {
			const newAppointmentValues = [];
			for (let i = 0; i < shiftHours * 3; i++) {
				const currentTime = new Date(hourCounter.getTime());
				hourCounter.setMinutes(hourCounter.getMinutes() + 20);
				newAppointmentValues.push({
					checked: false,
					label: `${format(currentTime, 'p')} - ${format(hourCounter, 'p')}`,
				})
			}
			setAppointmentValues([...newAppointmentValues]);
		}
	}, [practitioner])

	return (
		<>
			<DocModal
				isVisible={isVisible}
				onClose={() => setIsVisible(false)}
				content={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Typography>
							Are you sure you want to release the selected appointments?
						</Typography>
						<Box display="flex" pt={4}>
							<DocButton
								text='No'
								color='pink'
								onClick={() => setIsVisible(false)}
							/>
							<DocButton
								text='Yes'
								color='green'
								style={{ marginLeft: 10 }}
								onClick={() => setIsVisible(false)}
							/>
						</Box>
					</div>
				}
			/>
			<Box className={classes.container}>
				{practitioner ? (
					<>
						<h3>Practitioner Name: {practitioner.name}</h3>
						<Grid container justify="space-between">
							<Grid item xs={3}>
								<Typography className="row-text"><b>Shift Start Time: </b>{format(practitionerStartTime, 'p')}</Typography>
								<Typography className="row-text"><b>Shift End Time: </b>{format(practitionerEndTime, 'p')}</Typography>
							</Grid>
							<Grid item xs={3}>
								<Typography className="row-text"><b>Email Address: </b>{practitioner.email}</Typography>
								<Typography className="row-text"><b>Phone Number: </b>{practitioner.phone}</Typography>
							</Grid>
						</Grid>
						{!!appointmentValues.length && (
							<Box pt={10}>
								<h3>Select what to release:</h3>
								<FormControl component="fieldset" className={classes.formControl}>
									<FormGroup>
										<FormControlLabel
											control={<Checkbox checked={selectedAll} name="all" />}
											label="Select entire shift"
											onChange={(e) => {
												const newValue = [...appointmentValues.map((item) => ({ ...item, checked: e.target.checked }))];
												setAppointmentValues(newValue);
												setSelectedAll(e.target.checked);
											}}
											classes={{ label: classes.checkboxLabel }}
										/>
										<Grid container>
											{[...Array(shiftHours)].map((_, i) => (
												<Grid item key={i}>
													<Box display="flex" flexDirection="column">
														{[...Array(3)].map((_, j) => {
															const { label, checked } = appointmentValues[counter];
															counter++;
															return (
																<FormControlLabel
																	key={j}
																	label={label}
																	control={
																		<Checkbox
																			name={label}
																			checked={checked}
																			onChange={(e) => {
																				const newValue = [...appointmentValues.map((item) => item.label === e.target.name ? { ...item, checked: e.target.checked } : item)];
																				setAppointmentValues(newValue);
																			}}
																		/>
																	}
																/>
															);
														})}
													</Box>
												</Grid>
											))}
										</Grid>
									</FormGroup>
								</FormControl>
							</Box>
						)}
						<Box className="row center" display="flex">
							<DocButton
								text='Reassign'
								color='green'
							/>
							<DocButton
								text='Release'
								color='pink'
								style={{ marginLeft: 20 }}
								onClick={() => setIsVisible(true)}
							/>
						</Box>
					</>
				) : (
					<div className='row center' style={{ height: '100vh', alignContent: 'center' }}>
						<LoadingSpinner />
					</div>
				)}
			</Box>
		</>
	);
};

export default ShiftDetails;
