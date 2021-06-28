const start_hour = new Date(new Date(new Date().setHours(8)).setMinutes(0));
const end_hour = new Date(new Date(new Date().setHours(20)).setMinutes(0));

const WeekDays = [
    {
        active: false,
        day: 'Sunday',
        start_hour,
        end_hour,
        weekday: 1,
    },
    {
        active: false,
        day: 'Monday',
        start_hour,
        end_hour,
        weekday: 2,
    },
    {
        active: false,
        day: 'Tuesday',
        start_hour,
        end_hour,
        weekday: 3,
    },
    {
        active: false,
        day: 'Wednesday',
        start_hour,
        end_hour,
        weekday: 4,
    },
    {
        active: false,
        day: 'Thursday',
        start_hour,
        end_hour,
        weekday: 5,
    },
    {
        active: false,
        day: 'Friday',
        start_hour,
        end_hour,
        weekday: 6,
    },
    {
        active: false,
        day: 'Saturday',
        start_hour,
        end_hour,
        weekday: 7,
    },
];

export default WeekDays;
