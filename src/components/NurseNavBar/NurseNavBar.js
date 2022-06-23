import React, { memo } from 'react';
import { useHistory, NavLink } from 'react-router-dom';

import DocButton from '../DocButton/DocButton';
import './NurseNavBar.scss';

const NurseNavBar = props => {
	const logo = require('../../assets/images/icons/dochq-logo-rect-white.svg');
	let history = useHistory();

	const exit = () => {
		props.logout();
		history.push('/login');
	}

	return (
		<React.Fragment>
			<div className='nav-bar-container'>
				<div className='dochq-logo'>
					<img src={logo} alt='DocHQ Logo' />
				</div>
				<div className='nav-item'>
					<NavLink to='/practitioner/dashboard' activeClassName='active'>
						Dashboard
					</NavLink>
				</div>
				<div className='nav-item'>
					<DocButton color='pink' text='Logout' onClick={exit} style={{ marginTop: '0px' }} />
				</div>
			</div>
		</React.Fragment>
	);
};

export default memo(NurseNavBar);