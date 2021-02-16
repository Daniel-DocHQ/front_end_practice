import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthenticated, useRoleName } from '../context/AuthContext';

const AuthBasedRedirect = () => {
	const isAuthenticated = useAuthenticated();
	const roleName = useRoleName();
	function pathname() {
		if (!!roleName && isAuthenticated) {
			return `/${roleName}/dashboard`;
		} else {
			return '/login';
		}
	}
	return <Redirect to={pathname()} />;
};

export default AuthBasedRedirect;
