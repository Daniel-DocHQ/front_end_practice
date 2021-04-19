import React, { Component, useContext } from 'react';
import { ToastsStore } from 'react-toasts';
import dataURItoBlob from '../helpers/dataURItoBlob';
import getURLParams from '../helpers/getURLParams';
import nurseSvc from '../services/nurseService';

export const AppointmentContext = React.createContext();

export default class AppointmentContextProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: null,
			img: [],
			test_type: null,
			appointmentId: null,
			booking_users: null,
			status_changes: [],
			appointmentDetails: null,
			displayCertificates: null,
		};
		this.clearState = clearState.bind(this);
		this.getAppointmentDetails = getAppointmentDetails.bind(this);
		this.storeImage = storeImage.bind(this);
		this.uploadImage = uploadImage.bind(this);
		this.toggleDisplayCertificates = toggleDisplayCertificates.bind(this);
		this.updateNotes = updateNotes.bind(this);

		function clearState() {
			const keys = Object.keys(this.state);
			const newState = {};
			keys.forEach(k => {
				newState[k] = null;
			});
			this.setState(newState);
		}
		function getAppointmentDetails(appointmentId, token) {
			nurseSvc
				.getAppointmentDetails(
					!!appointmentId ? appointmentId : this.state.appointmentId,
					!!token
						? token
						: !!this.props.token
						? this.props.token
						: !!this.state.token
						? this.state.token
						: null
				)
				.then(result => {
					if (result.success && result.appointment) {
						const isCaptureDisabled =
							result && result.appointment && result.appointment.type === 'video_gp';
						const { booking_users, testing_kit_id, type, appointmentId: id, status_changes, booking_user: { metadata: { test_type }} } = result.appointment;
						this.setState({
							isCaptureDisabled,
							booking_users,
							testing_kit_id,
							appointmentDetails: result.appointment,
							appointmentId,
							test_type,
							type,
							status_changes,
						});
					} else {
						ToastsStore.error(`Cannot find appointment details`);
						localStorage.removeItem('appointmentId');
					}
				})
				.catch(err => {
					ToastsStore.error(`Cannot find appointment details`);
					localStorage.removeItem('appointmentId');
				});
		}
		function storeImage(img) {
			this.setState({ img: [...this.state.img, img] });
		}
		function uploadImage(appointmentId, token) {
			if (!!this.state.img) {
				const imageBlob = dataURItoBlob(this.state.img);
				imageBlob.name = `${this.state.appointmentId}.webp`;
				const formData = new FormData();
				formData.append('file', imageBlob);
				nurseSvc
					.uploadImage(
						!!appointmentId ? appointmentId : this.state.appointmentId,
						formData,
						!!token
							? token
							: !!this.props.token
							? this.props.token
							: !!this.state.token
							? this.state.token
							: null
					)
					.then(resp => {
						if (resp.success) {
							ToastsStore.success('Successfully uploaded image');
						} else {
							ToastsStore.error('Error uploading image, please try again');
						}
					})
					.catch(() => ToastsStore.error('Error uploading image, please try again'));
			} else {
				ToastsStore.error('No image provided');
			}
		}
		function toggleDisplayCertificates() {
			this.setState(prevState => ({
				displayCertificates: !!prevState.displayCertificates
					? !prevState.displayCertificates
					: true,
			}));
		}
		function updateNotes(notes) {
			nurseSvc
				.addNotes(
					this.state.appointmentId,
					notes,
					!!this.props.token ? this.props.token : !!this.state.token ? this.state.token : null
				)
		}
	}

	componentWillMount() {
		const params = getURLParams();
		const appointmentId = params['appointmentId'] || this.props.appointmentId;
		if (!!appointmentId && !!this.props.token) {
			this.getAppointmentDetails(appointmentId, this.props.token);
		}
		if (!!this.props.token) this.state.token = this.props.token;
	}
	componentWillUnmount() {
		this.clearState();
	}

	render() {
		return (
			<AppointmentContext.Provider
				value={{
					img: this.state.img,
					type: this.state.type,
					test_type: this.state.test_type,
					appointmentId: this.state.appointmentId,
					booking_users: this.state.booking_users,
					status_changes: this.state.status_changes,
					appointmentDetails: this.state.appointmentDetails,
					displayCertificates: this.state.displayCertificates,
					getAppointmentDetails: this.getAppointmentDetails,
					storeImage: this.storeImage,
					toggleDisplayCertificates: this.toggleDisplayCertificates,
					updateNotes: this.updateNotes,
				}}
			>
				{this.props.children}
			</AppointmentContext.Provider>
		);
	}
}
export const useAppointmentId = () => {
	const { appointmentId } = useContext(AppointmentContext);
	return appointmentId;
};
export const useAppointmentDetails = () => {
	const { appointmentDetails } = useContext(AppointmentContext);
	return appointmentDetails;
};
export const useBookingUsers = () => {
	const { booking_users } = useContext(AppointmentContext);
	return booking_users;
};
export const useBookingUser = role_profile_id => {
	const { booking_users } = useContext(AppointmentContext);
	return !!booking_users && !!booking_users[role_profile_id]
		? booking_users[role_profile_id]
		: null;
};

export const useCapturedImage = () => {
	const { img } = useContext(AppointmentContext);
	return !!img ? img : null;
};
