import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Tabs,
    Tab,
    Box,
    makeStyles,
} from '@material-ui/core';

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

const DiscountAppBar = ({ value, children }) => {
    const classes = useStyles();

	return (
        <>
            <AppBar position="static">
                <Tabs value={value} aria-label="simple tabs example">
                    <Tab
                        label="Discount Management"
                        {...a11yProps(0)}
                        classes={{
                            root: classes.tab,
                            selected: classes.selected,
                        }}
                        component={Link}
                        to="/super_admin/discount-management"
                    />
                    <Tab
                        label="Generate Discount"
                        {...a11yProps(1)}

                        classes={{
                            root: classes.tab,
                            selected: classes.selected,
                        }}
                        component={Link}
                        to="/super_admin/generate-discount"
                    />
                </Tabs>
            </AppBar>
            <Box className={classes.tabBox}>
                {children}
            </Box>
        </>
	);
};

export default memo(DiscountAppBar);
