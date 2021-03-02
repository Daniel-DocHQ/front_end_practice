import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext, useAuthenticated, useOrgProfile, useRoleName } from '../context/AuthContext';

function PrivateRoute({ children, requiredRole, requiredFlag, ...rest }) {
	const contextValue = useContext(AuthContext);
	const isAuthenticated = useAuthenticated();
	const roleName = useRoleName();
	const organisation_profile = useOrgProfile();
	const pathname = () => {
		if (!!roleName && isAuthenticated) {
			return `/${roleName}/dashboard`;
		} else {
			return '/login';
		}
	};
	function addProps() {
		const childrenWithProps = React.Children.map(children, child => {
			// checking isValidElement is the safe way and avoids a typescript error too
			const newProps = {
				...contextValue,
			};
			if (React.isValidElement(child)) {
				return React.cloneElement(child, newProps);
			}
			return child;
		});
		return childrenWithProps;
	}
	return (
		<Route
			{...rest}
			render={() => {
				if (
					typeof requiredFlag !== 'undefined' &&
					typeof requiredRole !== 'undefined' &&
					isAuthenticated &&
					!!organisation_profile &&
					!!organisation_profile[requiredFlag] &&
					organisation_profile[requiredFlag]
				) {
					return addProps();
				} else if (
					typeof requiredFlag === 'undefined' &&
					requiredRole === 'manager' &&
					isAuthenticated &&
					roleName === 'manager'
				) {
					return addProps();
				} else if (isAuthenticated && typeof requiredFlag === 'undefined') {
					return addProps();
				} else {
					return <Redirect to={{ pathname }} />;
				}
			}}
		/>
	);
}

export default PrivateRoute;
