import React from 'react';
import NewPassword from '../../components/ResetPassword/NewPassword';
const NewPasswordScreen = () => (
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
			<NewPassword />
		</div>
	</React.Fragment>
);

export default NewPasswordScreen;
