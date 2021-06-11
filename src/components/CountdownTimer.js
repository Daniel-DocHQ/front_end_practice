import React, { useState, useEffect } from 'react';

const msToHMS = (ms) => {
    let seconds = ms / 1000;
    seconds = seconds % 3600;
    let minutes = parseInt( seconds / 60 );
    seconds = Math.round(seconds % 60);

    return { minutes, seconds };
}

const timeToString = (minutes, seconds) =>
    (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);

const CountdownTimer = ({ timerStart, timerStop, onTimeEnd }) => {
    const [counter, setCounter] = useState(0);
    const [timeDifference, setTimeDifference] = useState(timerStop - timerStart);
    const { minutes, seconds } = msToHMS(timeDifference);
    const resultString = timeToString(minutes, seconds);

    useEffect(() => {
		const interval = setInterval(() => {
            if (timeDifference === 0) onTimeEnd()
            else {
                setTimeDifference(timeDifference - 1000);
                setCounter((prev) => prev + 1);
            }
		}, 1000);
		return () => clearInterval(interval);
	  }, [counter]);


    return (
        <span className="red-bold-text">{resultString}</span>
    );
};

export default CountdownTimer;
