import React, { useState } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UserMenu from './UserMenu';
import ClaimableNotification from './ClaimableNotification';
import './Navigation.scss';

const docIcon = require('../../assets/images/icons/dochq-logo-rect-white.svg');
const vistaLogo = require('../../assets/images/vista-logo.png');
const live = require('../../assets/images/icons/live.svg');
const liveActive = require('../../assets/images/icons/live-active.svg');
const calendar = require('../../assets/images/icons/calendar.svg');
const calendarActive = require('../../assets/images/icons/calendar-active.svg');
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	appBar: {
        padding: 0,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
	},
	appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
	},
	menuButton: {
	    marginRight: 36,
        color: 'white',
	},
	hide: {
	    display: 'none',
	},
	drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
	},
	drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
	},
	drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(8) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
	},
	toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    appToolbar: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        padding: 20,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    blackText: {
        color: 'black',
    },
}));

const AdminNavigator = ({
    role,
	title,
	isAuthenticated,
	user,
    token,
	logout,
}) => {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const isVista = window.location.href.includes('vista');
	const pathname = window.location.pathname;

	return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, 'top-navigation-container', {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar className={classes.appToolbar}>
                    <div className={classes.logoContainer}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={() => setOpen(true)}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        <div className='practice-logo'>
                            <img src={docIcon} alt='DocHQ Icon' />
                        </div>
                    </div>
                    <h1 className='page-title'>{title}</h1>
                    {isVista && (
                        <div className='practice-logo'>
                            <img src={vistaLogo} alt='Vista Health' className='vista-logo' />
                        </div>
                    )}
                    {isAuthenticated && (
                        <>
                            <ClaimableNotification title={title} token={token} />
                            <UserMenu
                                user={user}
                                logout={logout}
                            />
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <NavLink
                        to={`/${role}/dashboard`}
                        activeClassName='active'
                        style={{ display: 'flex' }}
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <i className='fa fa-home' style={{
                                    fontSize: '36px',
                                    color: pathname === `/${role}/dashboard` && '#e5014d'
                                }}></i>
                            </ListItemIcon>
                            <ListItemText
                                primary={"Home"}
                                className={clsx({
                                    [classes.blackText]: pathname !== `/${role}/dashboard`,
                                })}
                            />
                        </ListItem>
                    </NavLink>
                    <NavLink
                        activeClassName='active'
                        to={`/${role}/live/dashboard`}
                        style={{ display: 'flex' }}
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <img
                                    alt='Vista Health'
                                    style={{ fontSize: '36px' }}
                                    src={pathname.indexOf('live') > -1 ? liveActive : live}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={"Live Appointments"}
                                className={clsx({
                                    [classes.blackText]: pathname.indexOf('live') === -1,
                                })}
                            />
                        </ListItem>
                    </NavLink>
                    {role === 'shift_manager' && (
                        <NavLink
                            activeClassName='active'
                            to={`/${role}/doctors-management`}
                            style={{ display: 'flex' }}
                        >
                            <ListItem button>
                                <ListItemIcon>
                                    <img
                                        alt='Vista Health'
                                        style={{ fontSize: '36px', paddingLeft: 7 }}
                                        src={pathname === `/${role}/doctors-management` ? calendarActive : calendar}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={"Rota"}
                                    className={clsx({
                                        [classes.blackText]: pathname !== `/${role}/doctors-management`,
                                    })}
                                />
                            </ListItem>
                        </NavLink>
                    )}
                </List>
            </Drawer>
        </>
	);
};

export default AdminNavigator;
