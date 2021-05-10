import React, { useEffect, useState, setState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Fade,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const Certificate = ({children}) => (
    <React.Fragment>
        <Grid container spacing={2}>
            {children.map((c, i) => <Grid item xs={4} key={i}>{c}</Grid>)}
        </Grid>
    </React.Fragment>
)

export const CertificateForm = props => {
    const classes = useStyles();
    const [errors, setErrors] = useState({})
    const [formContents, setFormContents] = useState({
        forname: "",
        surname: "",
        date_of_birth:"",
        sex: "",
        security_checked: "",
        security_document: "",
        date_sampled: "",
        date_reported: "",
        result:"",
        medicalprofessional: "",
        supervisor:"",
        gmc:"",
        medical_clinic: "",
        cqc: "",
        product: "",
        type: "",
    })

    const handleChange = (e) => {
        setFormContents({
            ...formContents,
            [e.target.id]: e.target.value,
        })
    }

    const handleError = (id, value) => {
        setErrors({
            ...errors,
            [id]: value,
        })
    }

    const submitForm = () => {
        setErrors({})
        if (formContents.forname === "") handleError("forname", "Cannot be left empty");
        if (formContents.surname === "") handleError("surname", "Cannot be left empty");
        if (formContents.email === "") handleError("email", "Cannot be left empty");
    }

    return (
        <Fade in={true}>
            <Paper elevation={3} className={classes.paper}>
                <Typography variant="h4">Certificate form {props.key}</Typography>
                <Grid container direction="column" spacing={2}>
                    {/* First Name field */}
                    <Grid item> 
                        <TextField 
                            id="forname"
                            label="First Name"
                            onChange={handleChange}
                            value={formContents.forname}
                            error={typeof errors.forname !== 'undefined'}
                            helperText={errors.forname}
                        />
                    </Grid>
                    {/* Last Name field */}
                    <Grid item> 
                        <TextField 
                            id="surname"
                            label="Last Name"
                            onChange={handleChange}
                            value={formContents.surname}
                            error={typeof errors.surname !== 'undefined'}
                            helperText={errors.surname}
                        />
                    </Grid>
                    {/* Email field */}
                    <Grid item> 
                        <TextField 
                            id="email"
                            label="Email Address"
                            onChange={handleChange}
                            value={formContents.email}
                            error={typeof errors.email !== 'undefined'}
                            helperText={errors.email}
                        />
                    </Grid>
                    {/* Date of Birth field */}
                    <Grid item> 
                        <TextField 
                            id="date_of_birth"
                            label="Date of Birth"
                            onChange={handleChange}
                            value={formContents.date_of_birth}
                            error={typeof errors.date_of_birth !== 'undefined'}
                            helperText={errors.date_of_birth}
                        />
                    </Grid>
                    {/* Sex field */}
                    <Grid item> 
                        <TextField 
                            select
                            id="sex"
                            label="Patient Sex"
                            onChange={handleChange}
                            value={formContents.sex}
                            error={typeof errors.sex !== 'undefined'}
                            helperText={errors.sex}
                        >
                            <MenuItem key="Female" value="Female">Female</MenuItem>
                            <MenuItem key="Male" value="Male">Male</MenuItem>
                        </TextField>
                    </Grid>
                    {/* Security Checked field */}
                    <Grid item> 
                        <TextField 
                            id="security_checked"
                            label="Security Checked"
                            onChange={handleChange}
                            value={formContents.security_checked}
                            error={typeof errors.security_checked !== 'undefined'}
                            helperText={errors.security_checked}
                        />
                    </Grid>
                    {/* Security Document field */}
                    <Grid item> 
                        <TextField 
                            id="security_document"
                            label="Security Document"
                            onChange={handleChange}
                            value={formContents.security_document}
                            error={typeof errors.security_document !== 'undefined'}
                            helperText={errors.security_document}
                        />
                    </Grid>
                    {/* Test Result field */}
                    <Grid item> 
                        <TextField 
                            id="result"
                            label="Test Result"
                            onChange={handleChange}
                            value={formContents.result}
                            error={typeof errors.result !== 'undefined'}
                            helperText={errors.result}
                        />
                    </Grid>
                    {/* Security Checked field */}
                    <Grid item>
                        <Button onClick={submitForm}>Submit</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Fade>
    )
}

export default Certificate;
