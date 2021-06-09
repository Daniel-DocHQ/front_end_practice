import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        color: "#FFF",
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const LogDetailIcon = ({level}) => {
    if(level === 1) return <CheckIcon />
    if(level === 2) return <CheckIcon />
    if(level === 3) return <WarningIcon />
    if(level === 4) return <ErrorIcon />

    return <ErrorIcon />
}

const LogDetail = ({open, setOpen, data}) => {
    const classes = useStyles();
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    {(typeof data !== 'undefined' &&
                    <Typography variant="h6" className={classes.title}>
                        Job ran on {data.created_at}, Finished with status {data.result}
                    </Typography>
                    )}
                </Toolbar>
            </AppBar>
            {(typeof data !== 'undefined' && data.log.length !== 0 &&
                <List dense={true}>
                    {data.log.map(row => (
                        <ListItem key={row.id}>
                            <ListItemIcon>
                                <LogDetailIcon level={row.level} />
                            </ListItemIcon>
                            <ListItemText
                            primary={row.message}
                            secondary={(row.details && Object.keys(row.details).length !== 0 &&
                                <pre>{JSON.stringify(row.details, null, 2)}</pre>
                            )}
                            />
                        </ListItem>
                    ))}
                </List>)}
        </Dialog>
    )
}

export default LogDetail;
