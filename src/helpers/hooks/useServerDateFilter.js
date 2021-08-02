import clsx from 'clsx';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DateRangeFilter from '../../components/DateRangeFilter/DateRangeFilter';

const useStyles = makeStyles(() => ({
	btn: {
		fontSize: 14,
		border: '1px solid #EFEFF0',
		textTransform: 'none',
	},
	activeBtn: {
		fontWeight: 500,
		color: 'white',
		background: '#00BDAF',
	},
    container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}));

export const useServerDateFilter = ({ token, userId, query, status, isLive = false, practitionerName = false }) => {
    const today = moment();
	const [filter, setFilter] = useState('today');
	const [isLoading, setIsLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);
	const [start_time, setStartTime] = useState(today);
	const [end_time, setEndTime] = useState(today);

    const getData = async () => {
        setIsLoading(true);
        await query({
                dateRange: {
                    start_time: moment(start_time).utc(0).startOf('day').format(),
                    end_time: moment(end_time).utc(0).endOf('day').format(),
                },
                status,
                token,
                userId,
                practitionerName,
            })
            .then(data => {
                if (data.success) {
                    setAppointments(data.appointments);
                } else setAppointments([]);
            })
            .catch(err => {
                setAppointments([]);
                console.log(err);
            });
        setIsLoading(false);
    };

    const liveFunc = () => {
        const interval = setInterval(() => {
			getData();
            setFilter('today');
		}, 20000);
		return () => clearInterval(interval);
    };

	useEffect(() => {
        getData();
	}, [start_time, end_time]);

    useEffect(isLive ? liveFunc : null, []);

	return ({
        start_time,
        end_time,
        isLoading,
        setEndTime,
        setStartTime,
        appointments,
        filter,
        setFilter,
    });
};

export const DateFilter = ({
    filter,
    setFilter,
    appointments,
    setStartTime,
    setEndTime,
    end_time,
    start_time,
    isPast = false,
}) => {
    const today = moment();
    const classes = useStyles();
	const tomorrow = moment().add(1, 'day');
	const lastWeek = moment().subtract(7, 'day');
    const nextWeek = moment().add(7, 'day');
    const yesterday = moment().subtract(1, 'day');

    return (
        <div className={classes.container}>
            <ButtonGroup aria-label="outlined primary button group">
                {isPast && (
                    <>
                        <Button
                            className={clsx(
                                classes.btn,
                                {[classes.activeBtn]: filter === 'last week'},
                            )}
                            onClick={() => {
                                setFilter('last week');
                                setStartTime(lastWeek);
                                setEndTime(today)
                            }}
                        >
                            Week
                        </Button>
                        <Button
                            className={clsx(
                                classes.btn,
                                {[classes.activeBtn]: filter === 'yesterday'},
                            )}
                            onClick={() => {
                                setFilter('yesterday');
                                setStartTime(yesterday);
                                setEndTime(yesterday);
                            }}
                        >
                            Yesterday
                        </Button>
                    </>
                )}
                <Button
                    className={clsx(
                        classes.btn,
                        {[classes.activeBtn]: filter === 'today'},
                    )}
                    onClick={() => {
                        setFilter('today');
                        setStartTime(today);
                        setEndTime(today);
                    }}
                >
                    Today
                </Button>
                {!isPast && (
                    <>
                        <Button
                            className={clsx(
                                classes.btn,
                                {[classes.activeBtn]: filter === 'tomorrow'},
                            )}
                            onClick={() => {
                                setFilter('tomorrow');
                                setStartTime(tomorrow);
                                setEndTime(tomorrow);
                            }}
                        >
                            Tomorrow
                        </Button>
                        <Button
                            className={clsx(
                                classes.btn,
                                {[classes.activeBtn]: filter === 'week'},
                            )}
                            onClick={() => {
                                setFilter('week');
                                setStartTime(today);
                                setEndTime(nextWeek);
                            }}
                        >
                            Week
                        </Button>
                    </>
                )}
                <Button
                    className={clsx(
                        classes.btn,
                        {[classes.activeBtn]: filter === 'customize'},
                    )}
                    onClick={() => {
                        setFilter('customize');
                        setStartTime(moment(today).startOf('day'));
                        setEndTime(moment(today).endOf('day'));
                    }}
                >
                    Customize
                </Button>
            </ButtonGroup>
            {filter === 'customize' && (
                <div style={{ marginLeft: 20 }}>
                    <DateRangeFilter
                        startTime={new Date(start_time)}
                        setStartTime={(date) => setStartTime(moment(date))}
                        endTime={new Date(end_time)}
                        setEndTime={(date) => setEndTime(moment(date))}
                    />
                    {appointments.length >= 1000 && (
                        <p className="no-margin red-bold-text">
                            Too many appointments available.<br />
                            Please reduce the selected time frame.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DateFilter;
