import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { StepperContainer } from '../components/BookingEngine/Stepper';
import HRLayout from '../layouts/HRLayout';
import PatientLayout from '../layouts/PatientLayout';
import HRDashboard from '../screens/hr-portal/HRDashboard';
import Meeting from '../screens/Meeting';
import Dashboard from '../screens/nurse-portal/Dashboard';
import LoginScreen from '../screens/nurse-portal/LoginScreen';
import NewPasswordScreen from '../screens/nurse-portal/NewPasswordScreen';
import NurseMeeting from '../screens/nurse-portal/NurseMeeting';
import PatientDashboard from '../screens/patient-portal/PatientDashboard';
import PatientProfile from '../screens/patient-portal/PatientProfile';
import SymptomChecker from '../screens/patient-portal/SymptomChecker';
import Unsupported from '../screens/Unsupported';

import { AuthContext } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import TestResults from '../screens/patient-portal/TestResults';
import CompanyResults from '../screens/hr-portal/CompanyResults';
import UserSignUps from '../screens/hr-portal/UserSignUps';
import PatientHealthAssessment from '../components/PatientProfile/PatientHealthAssessment';
import Register from '../components/Register/Register';

const PrivateRouteHandler = () => {
	const {
		token,
		role,
		isAuthenticated,
		setRole,
		setRoleData,
		setToken,
		setIsAuthenticated,
		setUser,
	} = useContext(AuthContext);
	return (
		<React.Fragment>
			<Route path='/register'>
				<Register
					role={role}
					setRole={setRole}
					setRoleData={setRoleData}
					setToken={setToken}
					setIsAuthenticated={setIsAuthenticated}
					setUser={setUser}
				/>
			</Route>

			<Route exact path='/appointment'>
				<Meeting />
			</Route>
			<Route exact path='/booking'>
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
			</Route>
			{/* Generic Routes */}
			<Route exact path='/unsupported-browser'>
				<Unsupported />
			</Route>
			<Route exact path='/reset-password'>
				<NewPasswordScreen />
			</Route>
			<PrivateRoute
				exact
				path='/patient-symptom-checker'
				requiredRole='patient'
				children={
					<PatientLayout>
						<SymptomChecker />
					</PatientLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/patient-dashboard'
				requiredRole='patient'
				children={
					<PatientLayout>
						<PatientDashboard />
					</PatientLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/patient-profile'
				requiredRole='patient'
				children={
					<PatientLayout>
						<PatientProfile />
					</PatientLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/patient-test-results'
				requiredRole='patient'
				children={
					<PatientLayout>
						<TestResults />
					</PatientLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/patient-health-assessment'
				requiredRole='patient'
				children={
					<PatientLayout>
						<PatientHealthAssessment />
					</PatientLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/practitioner-dashboard'
				requiredRole='practitioner'
				children={<Dashboard />}
			/>
			<PrivateRoute
				exact
				path='/nurse-appointment'
				requiredRole='practitioner'
				children={<NurseMeeting isVideo={true} />}
			/>
			<PrivateRoute
				exact
				path='/face-to-face-appointment'
				requiredRole='practitioner'
				children={<NurseMeeting isVideo={false} />}
			/>
			<PrivateRoute
				exact
				path='/hr-dashboard'
				requiredRole='manager'
				children={
					<HRLayout>
						<HRDashboard />
					</HRLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/hr-results'
				requiredRole='manager'
				children={
					<HRLayout>
						<CompanyResults />
					</HRLayout>
				}
			/>
			<PrivateRoute
				exact
				path='/hr-sign-ups'
				requiredRole='manager'
				children={
					<HRLayout>
						<UserSignUps />
					</HRLayout>
				}
			/>
			<Route exact path='/login'>
				<LoginScreen />
			</Route>
			<Redirect to='/login' />
		</React.Fragment>
	);
};

export default PrivateRouteHandler;
