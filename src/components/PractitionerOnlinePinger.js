import React, { useEffect, useContext } from 'react';
import { get } from 'lodash';
import nurseService from '../services/nurseService';
import { AuthContext } from '../context/AuthContext';
import REQUEST_INTERVAL from '../helpers/requestInterval';

const PractitionerOnlinePinger = () => {
	const { user, token, logout } = useContext(AuthContext);
	const role = !!user && !!user.roles ? user.roles[0].name : '';
	const path = window.location.pathname;
	const roleName = 'practitioner';
    const isPractitioner = role === roleName && path.split('/').includes(roleName);

    useEffect(() => {
		const interval = setInterval(() => {
            if (isPractitioner) {
                nurseService.updateLastOnline(token)
					.catch((data) => {
						const status = get(data, 'response.status', '');
						if (status === 401) {
							logout();
						}
					});
            }
		}, REQUEST_INTERVAL);
		return () => clearInterval(interval);
    }, [user]);

	return <React.Fragment />;
};

export default PractitionerOnlinePinger;
