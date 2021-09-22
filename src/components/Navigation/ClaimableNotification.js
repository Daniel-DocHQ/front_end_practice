import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Badge, Tooltip } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons//Notifications';
import adminService from '../../services/adminService';
import './Navigation.scss';

const ClaimableNotification = ({ token, title }) => {
	const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const getClaimableAppointments = async () => {
        setIsLoading(true);
        await adminService.getAppointmentsSearch({
            dateRange: {
                start_time: moment().utc(0).startOf('day').format(),
                end_time:  moment().utc(0).add(7, 'day').endOf('day').format(),
            },
            token,
            status: 'CLAIMABLE',
        }).then(data => {
            if (data.success && data.appointments) {
                setAppointments(data.appointments);
            } else setAppointments([]);
        })
        .catch(err => {
            setAppointments([]);
            console.log(err);
        });
        setIsLoading(false);
    }

    useEffect(() => {
		getClaimableAppointments();
	}, [title]);

    return (isLoading || appointments.length < 1) ? null : (
        <div className="claimable-notification">
            <Tooltip title={`There are ${appointments.length} claimable appointments`}>
                <Badge badgeContent={appointments.length} color="secondary">
                    <NotificationsIcon  />
                </Badge>
            </Tooltip>
        </div>
    );
};

export default ClaimableNotification;
