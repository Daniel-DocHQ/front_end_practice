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

export const useServerDateFilter = ({
    token,
    userId,
    query,
    status,
    isLive = false,
    liveUpdateIn = null,
    fixedEndTime = null,
    practitionerName = false,
}) => {
    const today = moment();
	const [filter, setFilter] = useState('today');
	const [isLoading, setIsLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);
	const [start_time, setStartTime] = useState(today);
    const [end_time, setEndTime] = useState(!!fixedEndTime ? fixedEndTime : today);
	const [sortOrder, setSortOrder] = useState('');
    const [sortField, setSortField] = useState('');

    const compareFunc = (i, j, newSortOrder, sortField) => {
        if (i[sortField] < j[sortField]) {
            return newSortOrder === "asc" ? -1 : 1;
        } else {
            if (i[sortField] > j[sortField]) {
                return newSortOrder === "asc" ? 1 : -1;
            } else {
                return 0;
            }
        }
    };

    const sort = ({ sortBy = 'user_name' }) => {
        if (practitionerName) {
            const newSortOrder = sortBy !== sortField ? 'asc' : sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc';
            if (!!newSortOrder) {
                const newAppointments = [...appointments];
                setAppointments(newAppointments.sort((i, j) => compareFunc(i, j, newSortOrder, sortBy)))
            } else {
                getData(newSortOrder);
            }
            setSortField(!!newSortOrder ? sortBy : '');
            setSortOrder(newSortOrder);
        }
    };

    const getData = async (srtOrder) => {
        setIsLoading(true);
        await query({
                dateRange: {
                    start_time: (status === 'AVAILABLE' && filter === 'today') ? moment().utc(0).format() : moment(start_time).utc(0).startOf('day').format(),
                    end_time: !!fixedEndTime ? moment(fixedEndTime).utc(0).format() : moment(end_time).utc(0).endOf('day').format(),
                },
                status,
                token,
                userId,
                practitionerName,
            })
            .then(data => {
                if (data.success) {
                    const dataAppointments = [...data.appointments];
                    setAppointments(srtOrder && practitionerName
                        ? dataAppointments.sort((i, j) => compareFunc(i, j, srtOrder, sortField))
                        : dataAppointments);
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
			getData(sortOrder);
		}, !!liveUpdateIn ? liveUpdateIn : 60000 * 5);
		return () => clearInterval(interval);
    };

	useEffect(() => {
        getData(sortOrder);
	}, [start_time, end_time]);

    useEffect(isLive ? liveFunc : () => {}, []);

	return ({
        start_time,
        end_time,
        isLoading,
        setEndTime,
        setStartTime,
        appointments,
        filter,
        sortOrder,
        sort,
        setFilter,
        getData,
        sortField,
        setSortField,
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
                                'mobile-btn',
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
                                'mobile-btn',
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
                        'mobile-btn',
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
                                'mobile-btn',
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
                                'mobile-btn',
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
                        'mobile-btn',
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
