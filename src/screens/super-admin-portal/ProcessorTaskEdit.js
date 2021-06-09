import React, { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { NodeEditor } from "flume";
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import LogView from '../../components/Processor/LogView/LogView.js';
import {getNodeTypes } from '../../components/Processor/nodeTypes';

const processor = process.env.REACT_APP_PROCESSOR_URL || "https://processor-service-staging.dochq.co.uk";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    node: {
        height: 850,
    },
    actions: {
        float: 'right',
    },
    actionButtons: {
        marginLeft: theme.spacing(1),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const ProcessorTaskEdit = () => {
    const classes = useStyles();
    const nodeEditor = useRef()
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [nodes, setNodes] = useState({});
    const [event, setEvent] = useState();
    const [enabled, setEnabled] = useState();
    const [task, setTask] = useState({});
    const [templates, setTemplates] = useState([]);
    const [issueCertificateListOptions, setIssueCertificateListOptions] = useState([]);
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const nodeTypes = getNodeTypes(templates, issueCertificateListOptions);

    const handleChange = (event) => {
        setDescription(event.target.value);
    };

    const saveNodes = () => {
        console.log(nodeEditor.current.getNodes());
        new Promise((res, rej) => {
            axios({
                url: `${processor}/task/${id}`,
                method: "PUT",
                data:{
                    description: description,
                    task: nodeEditor.current.getNodes(),
                    comments: comments,
                    enabled: enabled,
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
                console.log(res)
            } else {
                console.error(res)
            }
        })
    }

    useEffect(() => {
        Promise.all([
            new Promise((res, rej) => {
                axios({
                    url: `${processor}/task/${id}`,
                    method: "GET",
                })
                    .then(response => {
                        if (response.status === 200) res(response)
                        else rej(response)
                    })
                    .catch(console.error)
            })
            .then(res => {
                if(res.status === 200 && res.data !== 'undefined') {
                    setDescription(res.data.description);
                    setEvent(res.data.event);
                    setNodes(res.data.task);
                    setEnabled(res.data.enabled);
                    setTask(res.data)
                    setComments(res.data.comments)
                } else {
                    console.error(res)
                }
            }),
            new Promise((res, rej) => {
                axios({
                    url: `${processor}/templates`,
                    method: "GET",
                })
                    .then(response => {
                        if (response.status === 200) res(response)
                        else rej(response)
                    })
                    .catch(console.error)
            })
            .then(res => {
                if(res.status === 200 && res.data !== 'undefined') {
                    var options = []
                    res.data.map(row => {
                        options.push({value: row.id, label: row.name})
                    })
                    setTemplates(options)
                } else {
                    console.error(res)
                }
            }),
            new Promise((res, rej)=> {
                // API call to be here later on
                res(true)
            }).then(res => {
                setIssueCertificateListOptions([
                    {value: "de_antigen_medical", label: "German Antigen Medical"},
                    {value: "de_antigen_travel", label: "German Antigen Travel"},
                    {value: "de_pcr_medical", label: "German PCR Medical"},
                    {value: "de_pcr_travel", label: "German PCR Travel"},
                    {value: "en_antigen_medical", label: "UK Antigen Medical"},
                    {value: "en_antigen_travel", label: "UK Antigen Travel"},
                    {value: "en_pcr_medical", label: "UK PCR Medical"},
                    {value: "en_pcr_travel", label: "UK PCR Travel"},
                ])
            })
        ])
        .then(res => {
            setLoading(false);
        })
        .catch(res => {
            setLoading(false);
        })
    }, [])

    useEffect(() => console.log(comments), [comments, setComments])

    if (loading) {
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        )
    }
    return (
        <div className={classes.root}>
            <Grid container spacing={3} maxwidth="sm">
                <Grid item xs={12}>
                    <Button variant="contained" component={ Link } to="/super_admin/processor">Go Back</Button>
                    <div className={classes.actions}>
                        <Button variant="contained" className={classes.actionButtons} onClick={saveNodes}>Save</Button>
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={2}
                            variant="outlined"
                            value={description}
                            onChange={handleChange}
                            fullWidth
                        />
                        </form>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.node}>
                        <NodeEditor
                            ref={nodeEditor}
                            portTypes={nodeTypes.portTypes}
                            nodeTypes={nodeTypes.nodeTypes}
                            nodes={nodes}
                            comments={comments}
                            onCommentsChange={setComments}
                            defaultNodes={[
                                {
                                    type: "eventStart",
                                    x: -589,
                                    y: -100
                                }
                            ]}
                    />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <LogView task={id} />
                </Grid>
            </Grid>
        </div>
    )
}

export default ProcessorTaskEdit;
