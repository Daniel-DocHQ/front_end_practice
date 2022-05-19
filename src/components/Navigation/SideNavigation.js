import React, { useState } from 'react';
import './Navigation.scss';
import { Tooltip } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const SideNavigation = ({ isPatient, isManager }) => {
	const [selectedTab, setSelectedTab] = useState('home');
	const [isVisible, setIsVisible] = useState(false);
	return (
		<React.Fragment>
			<div className='side-navigation-container'>
				<div className='side-navigation-menu'>
					<Tooltip title='Dashboard' placement='right' arrow>
						<NavLink to='/dashboard' className='side-navigation-tab' activeClassName='active'>
							<i className='fa fa-home'></i>
						</NavLink>
					</Tooltip>
					<Tooltip title='Manage Prescriptions' placement='right' arrow>
						<NavLink
							to='/prescription-management'
							className='side-navigation-tab'
							activeClassName='active'
						>
							<i className='fa fa-prescription-bottle'></i>
						</NavLink>
					</Tooltip>
					<Tooltip title='Manage Appointments' placement='right' arrow>
						<NavLink
							to='/appointment-management'
							className='side-navigation-tab'
							activeClassName='active'
						>
							<i className='fa fa-calendar-check'></i>
						</NavLink>
					</Tooltip>
					<Tooltip title='Manage Rota' placement='right' arrow>
						<NavLink to='/rota-management' className='side-navigation-tab' activeClassName='active'>
							<i className='fa fa-calendar-plus'></i>
						</NavLink>
					</Tooltip>
					<div className='floating-action-button'></div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SideNavigation;
