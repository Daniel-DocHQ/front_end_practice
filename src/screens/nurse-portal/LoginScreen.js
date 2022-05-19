import React from 'react';
import Login from '../../components/Login/Login';
const LoginScreen = () => (
	<React.Fragment>
		<div
			className='login-background'
			style={{
				backgroundColor: 'var(--doc-dark-grey)',
				minHeight: '100vh',
				overflow: 'hidden',
				width: '100%',
			}}
		>
			<Login />
		</div>
	</React.Fragment>
);

export default LoginScreen;
