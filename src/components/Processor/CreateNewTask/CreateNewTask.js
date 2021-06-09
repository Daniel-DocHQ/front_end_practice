import React, {useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    autocomplete: {
        width: 300,
    }
}));


const CreateNewTask = ({baseURL, orgList, eventList}) => {
    const classes = useStyles();
    const [org, setOrg] = useState(null);
    const [event, setEvent] = useState("");

    const submitForm = () => {
        if (event === "") {
            return
        }

        new Promise((res, rej) => {
            axios({
                url: `${baseURL}/task`,
                method: "POST",
                data:{
                    event: event,
                    organisation_id: `${org.id}`,
                }
            })
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
            .catch(console.error)
        })
        .then(res => {
            if(res.status === 200 && res.data !== 'undefined') {
                window.location = `/super_admin/processor/edit/${res.data.id}`
            } else {
                console.error(res)
            }
        })
    }

    return (
        <Grid
            container
            className={classes.Root}
            spacing={3}
            direction="row"
            justify="flex-start"
            alignItems="center"
        >
            <Grid item>
                <Autocomplete
                    className={classes.autocomplete}
                    id="organisation"
                    options={orgList}
                    getOptionLabel={(option) => option.name}
                    value={org}
                    onChange={(e, newVal) => {
                        setOrg(newVal)
                    }}
                    renderInput={(params) => <TextField {...params} label="Organisation" variant="outlined"/>}
                />
            </Grid>
            <Grid item>
                <Autocomplete
                    className={classes.autocomplete}
                    id="event"
                    freeSolo
                    options={eventList.map((option) => option.key)}
                    inputValue={event}
                    onInputChange={(e, val) => {
                        setEvent(val)
                    }}
                    renderInput={(params) => (<TextField {...params} label="Event" variant="outlined"/>)}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={submitForm}>Add</Button>
            </Grid>
        </Grid>
    )
}

export default CreateNewTask;
