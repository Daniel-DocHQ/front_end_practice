import React, { useContext } from 'react';
import Register from '../components/Register/Register';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = () => {
	const authContext = useContext(AuthContext);
	return (
		<React.Fragment>
			<Register {...authContext} />
		</React.Fragment>
	);
};

export default RegisterScreen;
