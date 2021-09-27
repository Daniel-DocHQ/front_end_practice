import React, { memo, useState } from 'react';
import {
    AppBar,
    Tabs,
    Tab,
    Box,
    makeStyles,
} from '@material-ui/core';
import LiveDoctorsManagement from './LiveDoctorsManagement';
import DoctorsManagement from './DoctorsManagement';

const useStyles = makeStyles(() => ({
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const NewDoctorsManagement = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

	return (
        <>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange}>
                    <Tab
                        label="Live"
                        {...a11yProps(0)}
                        classes={{
                            root: classes.tab,
                            selected: classes.selected,
                        }}
                    />
                    <Tab
                        label="Planning"
                        {...a11yProps(1)}

                        classes={{
                            root: classes.tab,
                            selected: classes.selected,
                        }}
                    />
                </Tabs>
            </AppBar>
            <Box className={classes.tabBox}>
                {value === 0 && (
                    <LiveDoctorsManagement {...props} />
                )}
                {value === 1 && (
                    <DoctorsManagement {...props} />
                )}
            </Box>
        </>
	);
};

export default memo(NewDoctorsManagement);
