import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthBasedRedirect = () => {
	const { role, isAuthenticated } = useContext(AuthContext);
	function pathname() {
		if (typeof role !== 'undefined' && isAuthenticated) {
			return `/${role}/dashboard`;
		} else {
			return '/login';
		}
	}
	return <Redirect to={pathname()} />;
};

export default AuthBasedRedirect;
