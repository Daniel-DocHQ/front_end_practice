import React from 'react';
import {
    Grid,
    Container,
    makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }
}));

const Contain = ({ children }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Container maxWidth="sm">
                <Grid container>
                    {children}
                </Grid>
            </Container>
        </div>
    )
};

export default Contain;
