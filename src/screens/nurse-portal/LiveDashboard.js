import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Tabs,
    Tab,
    Box,
    makeStyles,
} from '@material-ui/core';
import AppointmentLiveStatus from './AppointmentLiveStatus';
import { AuthContext } from '../../context/AuthContext';
import MyRooms from './MyRooms';
import getURLParams from '../../helpers/getURLParams';

const useStyles = makeStyles((theme) => ({
    tab: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'none',
    },
    selected: {
      color: 'white',
    },
    tabBox: {
        background: 'white',
        boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.1)',
        borderRightBottomRadius: 10,
        borderLeftBottomRadius: 10,
    },
  }));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  };

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const LiveDashboard = (props) => {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
    let history = useHistory();

    if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (appointmentId) {
            setValue(1);
        }
    }, []);
	return (
        <>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab
                        label="DocHQ"
                        {...a11yProps(0)}
                        classes={{
                            root: classes.tab,
                            selected: classes.selected,
                        }}
                    />
                    <Tab
                        label="My Rooms"
                        {...a11yProps(1)}

                        classes={{
                            root: classes.tab,
                            selected: classes.selected,
                        }}
                    />
                </Tabs>
            </AppBar>
            <Box className={classes.tabBox}>
                <TabPanel value={value} index={0}>
                    <AppointmentLiveStatus />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <MyRooms appointmentIdParam={appointmentId} />
                </TabPanel>
            </Box>
        </>
	);
};

export default memo(LiveDashboard);



