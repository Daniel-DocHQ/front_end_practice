import axios from 'axios';
import { format } from 'date-fns-tz';
import { get, startCase } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import {
	AppBar,
	Box,
	Grid,
	Paper,
	Container,
	Typography,
	Tooltip,
	Divider,
	CircularProgress,
	Toolbar,
	IconButton,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	List,
	ListItem,
	ListItemText,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ToastsStore } from 'react-toasts';
import CloseIcon from '@material-ui/icons/Close';

import DocModal from '../DocModal/DocModal';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';
import bookingService from '../../services/bookingService';
import copyToClipboard from '../../helpers/copyToClipboard';
import CertificatesAaron from '../Certificates/CertificatesAaron';
import AppointmentNotes from '../AppointmentView/AppointmentNotes';
import TextInputElement from '../../components/FormComponents/TextInputElement';

const orderUrl = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	table: {
		minWidth: 650,
	},
	container: {
		marginTop: 10,
	},
}));

const READABLE_STATUSES = {
    ND: 'Not Detected',
    DT: 'Detected',
    IDT: 'Indetermined',
};

const OrderDetails = ({ token, order, closeHandler }) => {
	const classes = useStyles();
	const [orderDetail, setOrderDetail] = useState({});
	const [discountValue, setDiscountValue] = useState();
	const [appointments, setAppointments] = useState([]);
	const [reloadInfo, setReloadInfo] = useState(false);
	const [addingNote, setAddingNote] = useState(false);
	const [notesStatus, setNotesStatus] = useState();
	const [notes, setNotes] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(<></>);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const refetchData = () => setReloadInfo((value) => !value);
	const swabbingMethod = get(orderDetail, 'items', []).find(({ product: { type }}) => type === 'Virtual');
	const orderItems = get(orderDetail, 'items', []).filter(({ product: { type } }) => type !== 'Virtual');
	const paymentStatus = get(orderDetail, 'payment_flag');

	const fetchData = async () => {
		if (!!order && !!order.id) {
			await adminService.getOrderDetails(order.id, token).then(res => {
				if (res.success && res.data) {
					setOrderDetail(res.data);
					if (!!res.data.discount) {
						adminService.validateDiscountCode(res.data.discount)
							.then(result => {
								if (result.success && result.data && result.data.value) {
									setDiscountValue(result.data);
								}
							}).catch(() => console.log('error'));
					}
				} else {
					setError(<>Something bad happened</>)
				}
				}).catch(res => {
					setError(<>{res.message}</>)
				});
			await bookingService.getAppointmentsByShortToken(order.id)
				.then(result => {
					if (result.success && result.appointments) {
						setAppointments(result.appointments);
					}
				});
		}
		setLoading(false);

	};

	useEffect(() => {
		fetchData();
	}, [reloadInfo]);

	const updateNotes = () => {
		return;
	};

	useEffect(() => {
		if (notesStatus && notesStatus.severity === 'success') {
			const timer = setTimeout(() => {
				setNotesStatus();
				refetchData();
				setAddingNote(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [notesStatus]);

	const handleCancelDialogToggle = () => {
		setCancelDialogOpen(!cancelDialogOpen);
	}
	return loading ? (
		<div className={classes.root}>
			<Grid container spacing={10} direction="column" justify="center" alignItems="center">
				<Grid item></Grid>
				<Grid item>
					<CircularProgress />
				</Grid>
				{error}
			</Grid>
		</div>
	) : (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={closeHandler}>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Order Details for {orderDetail.billing_detail.first_name} {orderDetail.billing_detail.last_name}
					</Typography>
				</Toolbar>
			</AppBar>
			<Container className={classes.container}>
				<Grid container spacing={3}>
					<Grid item container xs={12}>
						<Grid item xs={6}>
							<Typography variant="h6" className={classes.title}>
								Purchase Details
							</Typography>
							<List>
								<ListItem>
									<ListItemText>
										<b>Customer name</b>: {orderDetail.billing_detail.first_name} {orderDetail.billing_detail.last_name}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Email</b>: {orderDetail.billing_detail.email}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Phone</b>: {orderDetail.billing_address.telephone}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Purchase Date</b>: {format(new Date(orderDetail.created_at * 1000), 'dd/MM/yyyy p')}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Order number</b>: {orderDetail.short_token}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Payment status</b>: {orderDetail.payment_flag}
									</ListItemText>
								</ListItem>
							</List>
						</Grid>
						<Grid item xs={6}>
							<div className="row">
								<Typography variant="h6" className={classes.title}>
									Order Notes
								</Typography>
								<DocButton
									color="green"
									color={addingNote ? "pink" : "green"}
									onClick={() => setAddingNote(!addingNote)}
									text={addingNote ? "Cancel" : "Add note"}
								/>
							</div>
							{addingNote ? (
								<>
									<TextInputElement
										rows={4}
										multiline
										id='notes'
										value={notes}
										onChange={setNotes}
									/>
									<div className='row flex-end'>
										<DocButton
											color='green'
											text='Submit'
											onClick={() => {
												updateNotes(notes);
												setNotesStatus({ severity: 'success', message: 'Notes updated successfully' });
											}}
										/>
									</div>
									{!!notesStatus && !!notesStatus.severity && !!notesStatus.message && (
										<div className='row center'>
											<Alert
												variant="outlined"
												severity={notesStatus.severity}
											>
												{notesStatus.message}
											</Alert>
										</div>
									)}
								</>
							) : (
								<> </>
							)}
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6" className={classes.title}>
							Products
						</Typography>
						<TableContainer component={Paper}>
							<Table className={classes.table} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="right">Description</TableCell>
										<TableCell align="right">Type</TableCell>
										<TableCell align="right">Quantity</TableCell>
										<TableCell align="right">Return</TableCell>
										<TableCell align="right">Price</TableCell>
										{discountValue && (
											<>
												<TableCell align="right">Discount Value</TableCell>
												<TableCell align="right">Discount Price</TableCell>
											</>
										)}
									</TableRow>
								</TableHead>
								<TableBody>
									{orderItems.map((row) => (
										<TableRow key={row.order_id + row.product_id}>
											<TableCell component="th" scope="row">{row.product.title}</TableCell>
											<TableCell align="right">{row.product.description}</TableCell>
											<TableCell align="right">{row.product.type}</TableCell>
											<TableCell align="right">{row.quantity}</TableCell>
											<TableCell align="right">£{(row.return_method_id === 2 ? (10 * row.quantity) : 0).toFixed(2)}</TableCell>
											<TableCell align="right">£{row.product.price.toFixed(2)}</TableCell>
											{discountValue && (
												<>
													<TableCell align="right">
														{discountValue.value}{discountValue.type === 'percentage' ? '%' : '£'}
													</TableCell>
													<TableCell align="right">
														£{discountValue.type === 'percentage' ? (row.product.price - (row.product.price * (discountValue.value / 100))).toFixed(2) : '-'}
													</TableCell>
												</>
											)}
										</TableRow>
									))}
									<TableRow>
										<TableCell align="left">Total</TableCell>
										<TableCell align="right"></TableCell>
										<TableCell align="right"></TableCell>
										<TableCell align="right">{orderItems.reduce((sum, { quantity }) => (sum + quantity), 0)}</TableCell>
										<TableCell align="right">£{orderItems.reduce((sum, { quantity, return_method_id }) => (sum + (return_method_id === 2 ? (10 * quantity) : 0)), 0).toFixed(2)}</TableCell>
										<TableCell align="right">£{discountValue ? orderItems.reduce((sum, { quantity, product: { price } }) => (sum + price * quantity), 0).toFixed(2) : orderDetail.price.toFixed(2)}</TableCell>
										{discountValue && (
											<>
												<TableCell align="right">
													{discountValue.value}{discountValue.type === 'percentage' ? '%' : '£'}
												</TableCell>
												<TableCell align="right">
													£{orderDetail.price.toFixed(2)}
												</TableCell>
											</>
										)}
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
					{orderDetail.source !== 'Pharmacy' && (
						<Grid item xs={6}>
							<Typography variant="h6" className={classes.title}>
								Billing Details
							</Typography>
							<List>
								<ListItem>
									<ListItemText>
										<b>Address Line 1</b>: {orderDetail.billing_address.address_1}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Address Line 2</b>: {!!orderDetail.billing_address.address_2 ? orderDetail.billing_address.address_2 : '-'}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Post Code</b>: {orderDetail.billing_address.postcode}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>County</b>: {orderDetail.billing_address.county}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>
										<b>Town</b>: {orderDetail.billing_address.town}
									</ListItemText>
								</ListItem>
							</List>
						</Grid>
					)}
					<Grid item xs={6}>
						<Typography variant="h6" className={classes.title}>
							{orderDetail.source === 'Pharmacy' ? 'Customer Address' : 'Shipping Address'} 
						</Typography>
						<List>
							<ListItem>
								<ListItemText>
									<b>Address Line 1</b>: {orderDetail.shipping_address.address_1}
								</ListItemText>
							</ListItem>
							<ListItem>
								<ListItemText>
									<b>Address Line 2</b>: {!!orderDetail.shipping_address.address_2 ? orderDetail.shipping_address.address_2 : '-'}
								</ListItemText>
							</ListItem>
							<ListItem>
								<ListItemText>
									<b>Post Code</b>: {orderDetail.shipping_address.postcode}
								</ListItemText>
							</ListItem>
							<ListItem>
								<ListItemText>
									<b>County</b>: {orderDetail.shipping_address.county}
								</ListItemText>
							</ListItem>
							<ListItem>
								<ListItemText>
									<b>Town</b>: {orderDetail.shipping_address.town}
								</ListItemText>
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={12}>
						<Grid container justify="space-between" alignItems="center">
							<Grid item xs={7}>
								<Typography variant="h6" className={classes.title}>
									<b>Shipping status</b>: {orderDetail.shipping_flag}
								</Typography>
							</Grid>
							<Grid item xs={5}>
								<DocButton
									color="green"
									style={{ marginRight: 10 }}
									text="Send Order Confirmation"
									onClick={() => adminService.resendMessages({
										organisation_id: "1",
										event: "order.payment.complete",
										context: {
											"order_id": orderDetail.id.toString(),
										},
									}, token).then(result => {
										if (result.success) {
											ToastsStore.success('Message has been resent successfully!');
										} else {
											ToastsStore.error('Something went wrong!');
										}
									}).catch(() => ToastsStore.error('Something went wrong!'))}
								/>
								{paymentStatus === "Complete" && (
									<LinkButton
										color="green"
										linkSrc={`/b2c/book-appointment?short_token=${order.id}&service=video_gp_dochq`}
										text="Book an Appointment"
									/>
								)}
								<DocButton
									color="pink"
									style={{ marginLeft: 10 }}
									onClick={handleCancelDialogToggle}
									text="Cancel order"
								/>
								<CancelOrder
									order={orderDetail}
									open={cancelDialogOpen}
									onClose={handleCancelDialogToggle}
									loading={loading}
									token={token}
									setLoading={setLoading}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				{!!appointments.length && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Divider style={{ margin: '20px 0' }} />
							<Typography variant="h6" className={classes.title}>
								Appointments Details
							</Typography>
							{appointments.map((row, appointmentIndx) => (
								<AppointmentDetails
									key={row.id}
									token={token}
									orderItems={orderItems}
									shortToken={order.id}
									appointment={row}
									refetchData={refetchData}
									swabbingMethod={swabbingMethod}
									appointmentIndx={appointmentIndx}
								/>
							))}
						</Grid>
					</Grid>
				)}
			</Container>
		</div>
	)
}

const PatientDetails = ({ patient, appointmentId, refetchData, isCompleted }) => {
	const [isEditShow, setIsEditShow] = useState(false);
	const firstName = get(patient, 'metadata.forename', '') || patient.first_name;
	const lastName = get(patient, 'metadata.surname', '') || patient.last_name;
	const email = get(patient, 'metadata.email', '') || patient.email;
	const sex = get(patient, 'metadata.sex', '') || patient.sex;
	const date_of_birth = get(patient, 'metadata.date_of_birth', '') || patient.date_of_birth;
	const testType = get(patient, 'metadata.test_type', '');
	const phone = get(patient, 'phone', '');
	const ethnicity = get(patient, 'ethnicity', '');
	const passportNumber = get(patient, 'metadata.passport_number', '') || get(patient, 'metadata.passportId', '');
	const result = get(patient, 'metadata.result', '');
	const rejectedNotes = get(patient, 'metadata.reject_notes', '');
	const invalidNotes = get(patient, 'metadata.invalid_notes', '');
	const sampleTaken = get(patient, 'metadata.sample_taken', '');
	const kitId = get(patient, 'metadata.kit_id', '');
	const kitProvider = get(patient, 'metadata.kitProvider', '');
	const samplingDate = get(patient, 'metadata.date_sampled', '');
	const reportedDate = get(patient, 'metadata.date_reported', '');
	const dateOfReceipt = get(patient, 'metadata.date_of_receipt', '');

	return (
		<>
			<List component="div" disablePadding>
				<ListItem>
					<ListItemText>
						<b>Name</b>: {firstName} {lastName}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<b>Email</b>: {email}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<b>Phone Number</b>: {phone}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<b>Date of Birth</b>: {format(new Date(date_of_birth), 'dd/MM/yyyy')}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<b>Ethnicity</b>: {ethnicity}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<b>Sex</b>: {sex}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<b>Passport Number</b>: {passportNumber}
					</ListItemText>
				</ListItem>
				{!!samplingDate && (
					<>
						<Divider style={{ margin: '20px 0', width: '20%' }} />
						<ListItem>
							<ListItemText>
								<b>Sampling Date and Time: </b>{new Date(samplingDate).toUTCString()}
							</ListItemText>
						</ListItem>
					</>
				)}
				{!!reportedDate && (
					<ListItem>
						<ListItemText>
							<b>Reported Date and Time: </b>{new Date(reportedDate).toUTCString()}
						</ListItemText>
					</ListItem>
				)}
				<Box>
					{!!kitProvider && (
						<ListItem>
							<ListItemText>
								<b>KIT provider</b>: {kitProvider}
							</ListItemText>
						</ListItem>
					)}
					{!!sampleTaken && (
						<ListItem>
							<ListItemText>
								<b>Sample: </b>
								<span className={sampleTaken.toLowerCase()}>{sampleTaken}</span>
							</ListItemText>
						</ListItem>
					)}
					{!!kitId && (
						<ListItem>
							<ListItemText>
								<b>Kit ID: </b>
								<span>{kitId}</span>
							</ListItemText>
						</ListItem>
					)}
					{!!dateOfReceipt && (
						<ListItem>
							<ListItemText>
								<b>Received by Lab: </b>{new Date(dateOfReceipt).toUTCString()}
							</ListItemText>
						</ListItem>
					)}
					{!!result && (
						<ListItem>
							<Grid container justify="space-between">
								<Grid item>
									<ListItemText>
										<b>Test Result: </b>
										<span className={result.toLowerCase()}>{!!READABLE_STATUSES[result] ? READABLE_STATUSES[result] : result}</span>
									</ListItemText>
								</Grid>
								{(testType === 'Antigen' && isCompleted && !isEditShow) && (
									<Grid item>
										<DocButton
											text="Reissue Certificate"
											color="green"
											style={{ marginTop: 0, marginLeft: 10 }}
											onClick={() => setIsEditShow(!isEditShow)}
										/>
									</Grid>
								)}
							</Grid>
						</ListItem>
					)}
					{!!rejectedNotes && (
						<ListItem>
							<ListItemText>
								<b>Rejection Notes: </b>{rejectedNotes}
							</ListItemText>
						</ListItem>
					)}
					{!!invalidNotes && (
						<ListItem>
							<ListItemText>
								<b>Invalid Notes: </b>{invalidNotes}
							</ListItemText>
						</ListItem>
					)}
				</Box>
			</List>
			{isEditShow && (
				<CertificatesAaron
					patient_data={patient}
					appointmentId={appointmentId}
					submitCallback={() => {
						setIsEditShow(false);
						refetchData();
					}}
					cancelBtn={
						<DocButton
							text="Cancel"
							color="pink"
							onClick={() => setIsEditShow(!isEditShow)}
						/>
					}
				/>
			)}
		</>
	);
};

const AppointmentDetails = ({
	appointment,
	appointmentIndx,
	refetchData,
	token,
	swabbingMethod,
	orderItems = [],
	shortToken,
}) => {
	const linkRef = useRef(null);
	const timezone = get(Intl.DateTimeFormat().resolvedOptions(), 'timeZone', 'local time');
	const notes = get(appointment, 'notes', []);
	const [isVisible, setIsVisible] = useState(false);
	const appointmentStatus = appointment.status;
	const statusChanges = get(appointment, 'status_changes', []) || [];
	const isCompleted = appointmentStatus === 'COMPLETED';
    const flightDate = get(appointment, 'booking_user.metadata.travel_date');
    const product_id = get(appointment, 'product_id');

	return (
		<>
			<List>
				<ListItemText>
					<b>Appointment {appointmentIndx + 1}</b>
				</ListItemText>
				{!!flightDate && (
					<ListItem>
						<ListItemText>
							<b>Flight Date</b>: {format(new Date(flightDate), 'dd/MM/yyyy p', {timeZone: appointment.booking_user.tz_location})} ({appointment.booking_user.tz_location})
						</ListItemText>
					</ListItem>
				)}
				<ListItem>
					<ListItemText>
						<b>Test Type</b>: {appointment.booking_user.metadata.test_type}
					</ListItemText>
				</ListItem>
				{!!product_id && (
				<ListItem>
					<ListItemText>
						<b>Selected Product</b>: {orderItems.find(({ product_id }) => product_id === appointment.booking_user.product_id).product.title}
					</ListItemText>
					</ListItem>
				)}
				<ListItem>
					<ListItemText>
					{!!appointment.start_time ? (
						<>
							<b>Appointment Date</b>: {format(new Date(appointment.start_time), 'dd/MM/yyyy p')}  ({timezone})
						</>
					)  : (
						<>
							<b>Swabbing Method</b>: {swabbingMethod.product.title}
						</>
					)}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemText>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={linkRef}
								onClick={() => copyToClipboard(linkRef)}
								className='tab-row-text patient-link-text'
							>
								<b>Appointment Joining link</b>: https://{process.env.REACT_APP_JOIN_LINK_PREFIX}.dochq.co.uk/appointment?appointmentId={appointment.id}
							</Typography>
						</Tooltip>
					</ListItemText>
				</ListItem>
				{appointment.booking_users.map((patient, indx) => (
					<>
						<Divider style={{ margin: '20px 0', width: '30%' }} />
						<div key={indx}>
							<ListItemText>
								<b>Details of Passenger {indx + 1}</b>
							</ListItemText>
							<PatientDetails
								patient={patient}
								isCompleted={isCompleted}
								refetchData={refetchData}
								appointmentId={appointment.id}
							/>
						</div>
					</>
				))}
				<Divider style={{ margin: '20px 0', width: '30%' }} />
				<ListItem>
					<ListItemText>
						<b>Appointment Status</b>: {startCase(appointmentStatus === 'LOCKED' ? 'Locked' : appointmentStatus.replace('_', ' ').toLowerCase())}
					</ListItemText>
				</ListItem>
				{!!notes.length && (
					<ListItem>
						<AppointmentNotes notes={notes} />
					</ListItem>
				)}
				{!!statusChanges.length && (
					<ListItem>
						<ListItemText>
							<b>Appointment Status Changes</b>:
							{statusChanges.map(({ changed_to, created_at }, indx) => (
								<ListItem key={indx}>
									<ListItemText>
										<b>{startCase(changed_to.replace('_', ' ').toLowerCase())}</b> - {format(new Date(created_at), 'dd/MM/yyyy pp')} ({timezone})
									</ListItemText>
								</ListItem>
							))}
						</ListItemText>
					</ListItem>
				)}
			</List>
			{!isCompleted && (
				<Grid container justify="space-between">
					<Grid item xs={9}>
						<DocButton
							color="green"
							style={{ marginLeft: 10 }}
							text="Send Appointment Confirmation"
							onClick={() => adminService.resendMessages({
								organisation_id: "1",
								event: "appointment.booked",
								context: {
									"appointment_id": appointment.id
								},
							}, token).then(result => {
								if (result.success) {
									ToastsStore.success('Message has been resent successfully!');
								} else {
									ToastsStore.error(`Something went wrong!`);
								}
							}).catch(() => ToastsStore.error('Something went wrong!'))}
						/>
					</Grid>
					<Grid item xs={2}>
						<LinkButton
							color="green"
							linkSrc={`/customer_services/booking/edit?appointmentId=${appointment.id}&short_token=${shortToken}&service=video_gp_dochq`}
							text="Edit"
						/>
						<DocButton
							color="pink"
							style={{ marginLeft: 10 }}
							text="Delete"
							onClick={() => setIsVisible(true)}
						/>
					</Grid>
				</Grid>
			)}
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
						<p>Are you sure you want to delete this appointment?</p>
						<div className="row space-between">
							<DocButton
								color='green'
								text='No'
								onClick={() => setIsVisible(false)}
								style={{ marginRight: '5px' }}
							/>
							<DocButton
								color='pink'
								text='Yes'
								onClick={async () => {
									await bookingService.deleteBooking(appointment.id, token).catch(() => ToastsStore.error('Something went wrong'));
									refetchData();
									setIsVisible(false);
								}}
							/>
						</div>
					</div>
				}
			/>
			<Divider style={{ margin: '20px 0' }} />
		</>
	);
};

const CancelOrder = ({ order, open, onClose, loading, setLoading, token }) => {
	const classes = useStyles();
	const [emailAddress, setEmailAddress] = useState("")
	const [error, setError] = useState(<></>)

	const cancelOrder = () => {
		if (emailAddress === order.billing_detail.email) {
			setLoading(true)
			let apiCall = new Promise((res, rej) => {
				axios({
					method: 'delete',
					url: `${orderUrl}/v1/order/${order.id}`,
					headers: { Authorization: `Bearer ${token}` },
				}).then(res)
				.catch(rej)
			})
			apiCall.then(res => {
				if (res.status === 200 && typeof res.data) {
					setLoading(false)
					window.location.reload(false);
				} else {
					setError(<>Something bad happened</>)
					setLoading(false)
				}
			})
			.catch(res => {
				setError(<>{res.message}</>)
				setLoading(false)
			})
		}
	}

	return loading ? (
		<div className={classes.root}>
			<Grid container spacing={10} direction="column" justify="center" alignItems="center">
				<Grid item></Grid>
				<Grid item>
					<CircularProgress />
				</Grid>
				{error}
			</Grid>
		</div>
	) : (
		<Dialog
		open={open}
		onClose={onClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
			<DialogTitle id="alert-dialog-title">{"Cancel order?"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Upon canceling an order a refund will be issued to the customer for the amount on the order
					any shipping manifests will be called off and the order will not ship.
					If you are certain you want to cancel the order, please enter the order's email address ({order.billing_detail.email})
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Email Address"
					type="email"
					value={emailAddress}
					onChange={(e)=>setEmailAddress(e.target.value)}
					fullWidth
				/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						Close
					</Button>
					<Button onClick={cancelOrder} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
	)
}

export default OrderDetails;


