import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import service from '../services/nurseService';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Contain = ({children}) => {
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
}
const RegisterKit = ({token}) => {
    const classes = useStyles();
    const { id } = useParams();
    const [kitId, setKitId] = useState("");
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState({});

    const handleChange = (event) => {
        setKitId(event.target.value);
    };

    const handleSubmit = () => {
        setLoading(true)
        service.putBookingUserMetadata(booking.id, userId, {
            metadata: {
                kit_id: kitId,
                sample_taken: "valid",
                date_sampled: new Date().toISOString(),
                first_name: booking.booking_user.first_name,
                last_name: booking.booking_user.last_name,
            }
        }).then(res => {
            console.log(res)
            setLoading(false)
        }).catch(console.error)
    }

    useEffect(() => {
        service.getAppointmentDetails(id, "").then(res => {
            console.log(res)
            setBooking(res.appointment)
            setUserId(res.appointment.booking_user.id)
            setLoading(false)
        }).catch(console.error)
    }, [])

    return loading ? (
        <Contain>
            <Grid item xs={12}>
                <CircularProgress color="secondary" />
            </Grid>
        </Contain>
    ): (
        <Contain>
            <Grid item xs={12}>
                <Typography variant="h1" component="h2" gutterBottom>
                    Hello {booking.booking_user.first_name}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <InputLabel htmlFor="component-simple">Kit ID</InputLabel>
                    <Input id="component-simple" value={kitId} onChange={handleChange} />
                </FormControl>
                <Button variant="contained" color="secondary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Grid>
        </Contain>
    )
}


export default RegisterKit;
