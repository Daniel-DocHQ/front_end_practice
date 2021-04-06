import React, { useEffect, useContext } from 'react';
import nurseService from '../services/nurseService';
import { AuthContext } from '../context/AuthContext';
import REQUEST_INTERVAL from '../helpers/requestInterval';

const PractitionerOnlinePinger = () => {
	const { user, token } = useContext(AuthContext);
	const role = !!user && !!user.roles ? user.roles[0].name : '';
    const isPractitioner = role === 'practitioner';

    useEffect(() => {
		const interval = setInterval(() => {
            if (isPractitioner) {
                nurseService.updateLastOnline(token);
            }
		}, REQUEST_INTERVAL);
		return () => clearInterval(interval);
    }, [user]);

	return (
		<React.Fragment>
		</React.Fragment>
	);
};

export default PractitionerOnlinePinger;
