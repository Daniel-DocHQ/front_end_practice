import React, { useContext } from 'react';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import PatientHealthAssessment from '../components/PatientProfile/PatientHealthAssessment';
import Layout from '../layouts/Layout';
import CompanyResults from '../screens/hr-portal/CompanyResults';
import HRDashboard from '../screens/hr-portal/HRDashboard';
import UserSignUps from '../screens/hr-portal/UserSignUps';
import LoginScreen from '../screens/nurse-portal/LoginScreen';
import PatientDashboard from '../screens/patient-portal/PatientDashboard';
import PatientProfile from '../screens/patient-portal/PatientProfile';
import ShippingInfo from '../screens/patient-portal/ShippingInfo';
import SymptomChecker from '../screens/patient-portal/SymptomChecker';
import ResultsScreen from '../screens/patient-portal/ResultsScreen.js';
import AuthBasedRedirect from './AuthBasedRedirect';
import { AuthContext } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import VerifyToken from '../screens/VerifyToken';
import HelpScreen from '../screens/HelpScreen';
import OrderKit from '../components/OrderKit/OrderKit';
import { StepperContainer } from '../components/BookingEngine/Stepper';
import Unsupported from '../screens/Unsupported';
import Meeting from '../screens/Meeting';
import NurseDashboard from '../screens/nurse-portal/NurseDashboard';
import BookingEngine from '../components/BookingEngineAuthed/BookingEngine';
import NurseMeeting2 from '../screens/nurse-portal/NurseMeeting2';
import Purchase from '../screens/b2c-portal/Purchase';
import B2CDashboard from '../screens/b2c-portal/B2CDashboard';
import B2CBookAppointment from '../screens/b2c-portal/B2CBookAppointment';
import LiveDashboard from '../screens/nurse-portal/LiveDashboard';
import RotaManagement from '../screens/nurse-portal/RotaManagement';

const { isSupported } = require('twilio-video');

const RouteContainer = () => {
	return (
		<React.Fragment>
			<ToastsContainer store={ToastsStore} />
			<Router>
				<Switch>
					<RouteHandler />
				</Switch>
			</Router>
		</React.Fragment>
	);
};
export default RouteContainer;

const RouteHandler = () => {
	const ctx = useContext(AuthContext);
	return (
		<Switch>
			<Route path='/login'>
				<LoginScreen />
			</Route>

			{/* Identities redirects to /verify-token */}

			<Route path='/verify-token'>
				<VerifyToken {...ctx} />
			</Route>

			{/* Unauthenticated routes */}

			<Route path='/book'>
				<Layout title='Book Appointment'>
					<div className='booking-engine'>
						<StepperContainer
							location='CITYDOC BANSTEAD'
							postcode='SO53 2FS'
							location_data={{
								name: 'CITYDOC BANSTEAD',
								address: 'CITYDOC BANSTEAD',
							}}
						/>
					</div>
				</Layout>
			</Route>
			<Route exact path='/unsupported-browser'>
				<Unsupported />
			</Route>

			<PrivateRoute path='/authenticated/book'>
				<Layout title='Book Appointment'>
					<BookingEngine {...ctx} />
				</Layout>
			</PrivateRoute>

			<Route path='/appointment'>
				{isSupported ? <Meeting /> : <Redirect to='/unsupported-browser' />}
			</Route>
			{/* Patient Routes */}

			<PrivateRoute exact path='/patient/dashboard' requiredRole='patient'>
				<Layout title='Dashboard'>
					<PatientDashboard />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/profile' requiredRole='patient'>
				<Layout title='My Account'>
					<PatientProfile />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/shipping-info' requiredRole='patient'>
				<Layout title='Shipping Info'>
					<ShippingInfo />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/symptom-checker' requiredRole='patient'>
				<Layout title='Symptom Checker'>
					<SymptomChecker />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/health-assessment' requiredRole='patient'>
				<Layout title='My Health profile'>
					<PatientHealthAssessment />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/test-results' requiredRole='patient'>
				<Layout title='My Results'>
					<ResultsScreen />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/help' requiredRole='patient'>
				<Layout title='Help Portal'>
					<HelpScreen />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/order-test-kit' requiredRole='patient' requiredFlag='order_kit'>
				<Layout title='Order Kit'>
					<OrderKit />
				</Layout>
			</PrivateRoute>
			<Route path='/patient/*'>
				<Redirect to={`/${ctx.role}/dashboard`} />
			</Route>
			{/* Admin Routes */}

			<PrivateRoute exact path='/manager/dashboard' requiredRole='manager'>
				<Layout title='Dashboard'>
					<HRDashboard />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/manager/test-results' requiredRole='manager'>
				<Layout title='Organisation Results'>
					<CompanyResults />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/manager/sign-ups' requiredRole='manager'>
				<Layout title='Organisation Sign Ups'>
					<UserSignUps />
				</Layout>
			</PrivateRoute>
			<Route path='/manager/*'>
				<Redirect to={`/${ctx.role}/dashboard`} />
			</Route>
			{/* Practitioner Routes */}

			<PrivateRoute path='/practitioner/dashboard' requiredRole='practitioner'>
				<Layout title='Dashboard'>
					<NurseDashboard {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/live-dashboard' requiredRole='practitioner'>
				<Layout title='Live Dashboard'>
					<LiveDashboard {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/rota' requiredRole='practitioner'>
				<Layout title='Rota Management'>
					<RotaManagement {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/video-appointment' requiredRole='practitioner'>
				<Layout title='Video Appointment'>
					<NurseMeeting2 isVideo={true} {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/face-to-face-appointment' requiredRole='practitioner'>
				<Layout title='Appointment'>
					<NurseMeeting2 isVideo={false} {...ctx} />
				</Layout>
			</PrivateRoute>
			<Route path='/practitioner/*'>
				<Redirect to={`/${ctx.role}/dashboard`} />
			</Route>
			{/* B2C Routes */}

			<PrivateRoute path='/b2c/dashboard' requiredRole='b2c'>
				<Layout title='Dashboard'>
					<B2CDashboard />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/b2c/order-test-kit' requiredRole='b2c'>
				<Layout title='Purchase'>
					<Purchase />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/b2c/book-appointment' requiredRole='b2c'>
				<Layout title='Book Appointment'>
					<B2CBookAppointment />
				</Layout>
			</PrivateRoute>
			{/* 404 page */}

			<Route path='*'>
				<AuthBasedRedirect />
			</Route>
		</Switch>
	);
};
