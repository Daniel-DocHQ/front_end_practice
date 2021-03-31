import React, { useEffect, useState, memo } from 'react';
import adminService from '../../services/adminService';
import { useHistory } from 'react-router-dom';
import RotaPastAppointmentsTable from '../../components/Tables/RotaPastAppointmentsTable';

const RotaManagement = props => {
	const doctors = [
		{
			first_name: 'Bruce',
			last_name: 'Wayne',
			start_time: '2021-03-19T08:30:00Z',
			end_time: '2021-03-19T17:00:00Z',
			start_in: {
				minutes: 5,
				seconds: 59,
			},
			status: 'online',
		},
		{
			first_name: 'Mike',
			last_name: 'Johnson',
			start_time: '2021-03-19T08:30:00Z',
			end_time: '2021-03-19T17:00:00Z',
			start_in: {
				minutes: 4,
				seconds: 23,
			},
			status: 'offline',
		},
		{
			first_name: 'Taylor',
			last_name: 'Xavier',
			start_time: '2021-03-19T08:30:00Z',
			end_time: '2021-03-19T17:00:00Z',
			start_in: {
				minutes: 20,
				seconds: 15,
			},
			status: 'offline',
		},
		{
			first_name: 'Lady',
			last_name: 'Young',
			start_time: '2021-03-19T08:30:00Z',
			end_time: '2021-03-19T17:00:00Z',
			start_in: {
				minutes: 3,
				seconds: 10,
			},
			status: 'online',
		},
		{
			first_name: 'Loureen',
			last_name: 'Ling',
			start_time: '2021-03-19T08:30:00Z',
			end_time: '2021-03-19T17:00:00Z',
			start_in: {
				minutes: 15,
				seconds: 11,
			},
			status: 'offline',
		},
	];

	let history = useHistory();
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}

	return (
        <RotaPastAppointmentsTable
            doctors={doctors}
        />
	);
};

export default memo(RotaManagement);
