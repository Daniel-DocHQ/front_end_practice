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
import B2CRegisterTrip from '../screens/b2c-portal/B2CRegisterTrip';
import PharmacyActivateTestKit from '../screens/b2c-portal/PharmacyActivateTestKit';
import EditBookedAppointment from '../screens/cs-portal/EditBookedAppointment';
import LiveDashboard from '../screens/nurse-portal/LiveDashboard';
import RotaManagement from '../screens/nurse-portal/RotaManagement';
import AppointmentView from '../components/AppointmentView/AppointmentView';
import ShiftDetails from '../screens/nurse-portal/ShiftDetails';
import TermsConditionsDe from '../screens/TermsConditionsDe';
import TermsConditionsEn from '../screens/TermsConditionsEn';
import MyRooms from '../screens/nurse-portal/MyRooms';
import SADashboard from '../screens/super-admin-portal/SADashboard';
import CertificatesList from '../screens/super-admin-portal/CertificatesList';
import ProcessorManagement from '../screens/super-admin-portal/ProcessorManagement';
import ProcessorTaskEdit from '../screens/super-admin-portal/ProcessorTaskEdit';
import PcrManagementTable from '../screens/super-admin-portal/PcrManagementTable';
import CSOrderList from '../screens/cs-portal/CSOrderList';
import SAOrderList from '../screens/super-admin-portal/SAOrderList';
import SADropboxList from '../screens/super-admin-portal/SADropboxList';
import SADropboxView from '../screens/super-admin-portal/SADropboxView';
import SACreateDropbox from '../screens/super-admin-portal/SACreateDropbox';
import PickupsManagement from '../screens/super-admin-portal/PickupsManagement';
import DropboxReceipts from '../screens/super-admin-portal/DropboxReceipts';
import GenerateDiscount from '../screens/super-admin-portal/GenerateDiscount';
import CSDashboard from '../screens/cs-portal/CSDashboard';
import RegisterKit from '../screens/RegisterKit';
import LufthansaTestRegister from '../screens/b2c-portal/LufthansaTestRegister';
import SADiscountManagement from '../screens/super-admin-portal/SADiscountManagement';
import SmDashboard from '../screens/sm-portal/SmDashboard';
import SmLiveDashboard from '../screens/sm-portal/SmLiveDashboard';
import SmMyRooms from '../screens/sm-portal/SmMyRooms';
import OFLBookingAppointment from '../screens/b2c-portal/OFLBookingAppointment';
import NewDoctorsManagement from '../screens/super-admin-portal/NewDoctorsManagement';
import ProductManagement from '../screens/super-admin-portal/ProductManagement';
import SAPickupManagement from '../screens/super-admin-portal/SAPickupManagement';
import SAProductView from '../screens/super-admin-portal/SAProductView';
import SACreateProduct from '../screens/super-admin-portal/SACreateProduct';

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
            <Route path="/register-kit/:id">
				<Layout title='Register Kit'>
                    <RegisterKit {...ctx} />
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
			<Route path='/en/consultation/terms'>
				<Layout title='Terms and Conditions'>
					<TermsConditionsEn {...ctx} />
				</Layout>
			</Route>
			<Route path='/de/consultation/terms'>
				<Layout title='Terms and Conditions'>
					<TermsConditionsDe {...ctx} />
				</Layout>
			</Route>
			<Route path='/appointment'>
				{isSupported ? <Meeting /> : <Redirect to='/unsupported-browser' />}
			</Route>
			{/* Patient Routes */}

			<PrivateRoute exact path='/patient/dashboard' requiredRole='patient'>
				<Layout title='Dashboard'>
					<PatientDashboard />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/patient/profile'>
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
			<PrivateRoute path='/practitioner/live/dashboard' requiredRole='practitioner'>
				<Layout title='Live Dashboard'>
					<LiveDashboard {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/live/my-rooms' requiredRole='practitioner'>
				<Layout title='Live Dashboard'>
					<MyRooms {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/rota' requiredRole='practitioner'>
				<Layout title='Rota Management'>
					<RotaManagement {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/shift-details' requiredRole='practitioner'>
				<Layout title='Shift Details'>
					<ShiftDetails {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/appointment'>
				<Layout title='Appointment Information'>
					<AppointmentView {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/practitioner/video-appointment'>
				<Layout title='Video Appointment'>
					<NurseMeeting2 isVideo isHackLink {...ctx} />
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
			<Route path='/book_test_OFL' requiredRole='b2c'>
				<Layout title="Book an appointment">
					<OFLBookingAppointment />
				</Layout>
			</Route>
			<Route path='/test-register' requiredRole='b2c'>
				<Layout title="Book an appointment">
					<LufthansaTestRegister />
				</Layout>
			</Route>
			<Route path='/activate-kit' requiredRole='b2c'>
				<Layout title="Book an appointment">
					<PharmacyActivateTestKit />
				</Layout>
			</Route>
			<PrivateRoute path='/b2c/order-test-kit' requiredRole='b2c'>
				<Layout title='Purchase'>
					<Purchase />
				</Layout>
			</PrivateRoute>
			<Route path='/b2c/book-appointment'>
				<Layout title='Book Appointment'>
					<B2CBookAppointment />
				</Layout>
			</Route>
			<Route path='/b2c/register-trip'>
				<Layout title='Register your trip'>
					<B2CRegisterTrip />
				</Layout>
			</Route>
			{/* Shift Manager Routes */}
			<PrivateRoute path='/shift_manager/dashboard' requiredRole='shift_manager'>
				<Layout title='Dashboard'>
					<SmDashboard {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/shift_manager/doctors-management' requiredRole='shift_manager'>
				<Layout title='Doctors Management'>
					<NewDoctorsManagement {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/shift_manager/live/dashboard' requiredRole='shift_manager'>
				<Layout title='Live Dashboard'>
					<SmLiveDashboard {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/shift_manager/live/my-rooms' requiredRole='shift_manager'>
				<Layout title='My Rooms'>
					<SmMyRooms {...ctx} />
				</Layout>
			</PrivateRoute>
			{/* Super Admin Routes */}

			<PrivateRoute path='/super_admin/dashboard' requiredRole='super_admin'>
				<Layout title='Dashboard'>
					<SADashboard {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/collection/:id' requiredRole={['customer_services', 'super_admin']}>
				<Layout title='Pick up Management'>
					<SAPickupManagement />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/product-management' requiredRole='super_admin'>
				<Layout title='Product Management'>
					<ProductManagement />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/generate-discount' requiredRole='super_admin'>
				<Layout title='Generate Discount'>
					<GenerateDiscount />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/pickups-list' requiredRole='super_admin'>
				<Layout title='Pickups List'>
					<PickupsManagement />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/discount-management' requiredRole='super_admin'>
				<Layout title='Discount List'>
					<SADiscountManagement />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/dropbox-list' requiredRole='super_admin'>
				<Layout title='Dropbox List'>
					<SADropboxList />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/product/create' requiredRole='super_admin'>
				<Layout title='Create Product'>
					<SACreateProduct />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/dropbox/create' requiredRole='super_admin'>
				<Layout title='Create Dropbox'>
					<SACreateDropbox />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/dropbox-receipts/:id' requiredRole='super_admin'>
				<Layout title='Dropbox Receipts'>
					<DropboxReceipts />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/product/:id' requiredRole='super_admin'>
				<Layout title='Product View'>
					<SAProductView />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/dropbox/:id' requiredRole='super_admin'>
				<Layout title='Dropbox View'>
					<SADropboxView />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/certificates-list' requiredRole='super_admin'>
				<Layout title='Certificates List'>
					<CertificatesList {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/doctors-management' requiredRole='super_admin'>
				<Layout title='Doctors Management'>
					<NewDoctorsManagement />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/pcr-management' requiredRole='super_admin'>
				<Layout title='PCR Tests Management'>
					<PcrManagementTable />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/super_admin/order-list' requiredRole='super_admin'>
				<Layout title='Order List'>
					<SAOrderList {...ctx} />
				</Layout>
			</PrivateRoute>
            <PrivateRoute path='/super_admin/processor/edit/:id' requiredRole='super_admin'>
				<Layout title='Processor Task Edit'>
					<ProcessorTaskEdit {...ctx} />
				</Layout>
			</PrivateRoute>
            <PrivateRoute path='/super_admin/processor' requiredRole='super_admin'>
				<Layout title='Processor Management'>
					<ProcessorManagement {...ctx} />
				</Layout>
			</PrivateRoute>
			{/* Customer Services Routes */}

			<PrivateRoute path='/booking/edit' requiredRole={['customer_services', 'super_admin']}>
				<Layout title='Edit Booking'>
					<EditBookedAppointment  {...ctx} />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/customer_services/dashboard' requiredRole='customer_services'>
				<Layout title='Dashboard'>
					<CSDashboard />
				</Layout>
			</PrivateRoute>
			<PrivateRoute path='/customer_services/order-list' requiredRole='customer_services'>
				<Layout title='Order List'>
					<CSOrderList {...ctx} />
				</Layout>
			</PrivateRoute>
			{/* 404 page */}

			<Route path='*'>
				<AuthBasedRedirect />
			</Route>
		</Switch>
	);
};
