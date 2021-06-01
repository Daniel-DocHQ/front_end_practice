import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { get } from 'lodash';
import './AppointmentView.scss';

const AppointmentNotes = ({ notes }) => {
    const filteredNotes = notes.filter(({ content }) => !content.includes('Status Change') && !content.includes('GDPR Terms Change:'));
    const notesLength = filteredNotes.length;

    return !!notesLength && (
        <Box>
           <Typography className="row-text"><b>Appointment Notes:</b></Typography>
            <Typography>{get(filteredNotes, `${notesLength - 1}.content`, '')}</Typography>
        </Box>
    );
};

export default AppointmentNotes;