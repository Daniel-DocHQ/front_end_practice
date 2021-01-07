import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children, requiredRole, requiredFlag, ...rest }) {
	const contextValue = useContext(AuthContext);
	const pathname = () => {
		if (typeof contextValue.role !== 'undefined' && contextValue.isAuthenticated) {
			return `/${contextValue.role}/dashboard`;
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
					contextValue.isAuthenticated &&
					typeof contextValue.organisation_profile !== 'undefined' &&
					contextValue.organisation_profile[requiredFlag]
				) {
					return addProps();
				} else if (
					typeof requiredFlag === 'undefined' &&
					requiredRole === 'manager' &&
					contextValue.isAuthenticated &&
					contextValue.role === 'manager'
				) {
					return addProps();
				} else if (contextValue.isAuthenticated && typeof requiredFlag === 'undefined') {
					return addProps();
				} else {
					return <Redirect to={{ pathname }} />;
				}
			}}
		/>
	);
}

export default PrivateRoute;
