import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'left',
    },
    accordian: {
        marginTop: 30,
    }
}));
const TestHelp = props => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <React.Fragment>
            <Typography variant="h4" className={classes.title}>Help</Typography>
            <div className={classes.accordian}>
                {/* Understanding your results */}
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography className={classes.heading}>Understanding your RT-PCR results</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Typography variant="h4"><i className='fa fa-check' style={{ color: 'var(--doc-green)' }}></i> Positive</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" align="left">
                                    The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis
                                    indicates that genetic material from SARS-CoV-2 was found in the test sample and the
                                    individual has confirmed coronavirus disease.
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4"><i className='fa fa-times' style={{ color: 'var(--doc-pink)' }}></i> Negative</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" align="left">
                                    The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis
                                    indicates that no genetic material from SARS-CoV-2 was not found in the test sample, the
                                    individual does not have coronavirus disease.
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                {/* What do I do if my RT-PCR test result is negitive? */}
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography className={classes.heading}>What do I do if my RT-PCR test result is negative?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Typography variant="body1" align="left">
                                    You do not need to self-isolate if your test is negative, as long as:
                                    <ul>
                                        <li>everyone you live with who has symptoms tests negative</li>
                                        <li>everyone in your support bubble who has symptoms tests negative</li>
                                        <li>
                                            you were not told to self-isolate for 14 days by NHS Test and Trace – if you were, see
                                            what to do if you've been told you've been in contact with someone who has coronavirus
                                        </li>
                                        <li>you feel well – if you feel unwell, stay at home until you’re feeling better</li>
                                        <li>
                                            If you have diarrhea or you’re being sick, stay at home until 48 hours after they've
                                            stopped
                                        </li>
                                    </ul>
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                {/* What do I do if my RT-PCR test result is positive? */}
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography className={classes.heading}>What do I do if my RT-PCR test result is positive?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Typography variant="body1" align="left">
                                    If your test is positive, you must self-isolate immediately.
                                    If you had a test because you had symptoms, keep self-isolating for at least 10 days from when your symptoms started.
                                    If you had a test but have not had symptoms, self-isolate for 10 days from when you had the test.
                                    Anyone you live with, and anyone in your support bubble, must self-isolate for 14 days from when you start self-isolating.
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>
        </React.Fragment>
    );
}

export default TestHelp;
