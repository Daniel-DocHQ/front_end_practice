import React from 'react';
import { format } from 'date-fns';
import { Box, Typography } from '@material-ui/core';
import { get } from 'lodash';
import './AppointmentView.scss';

const AppointmentNotes = ({ notes }) => {
    const timezone = get(Intl.DateTimeFormat().resolvedOptions(), 'timeZone', 'local time');
    const filteredNotes = notes.filter(({ content }) => !content.includes('Status Change') && !content.includes('GDPR Terms Change:'));

    return !!filteredNotes.length && (
        <Box>
           <Typography className="row-text"><b>Appointment Notes:</b></Typography>
            {filteredNotes.map(({ created_at, content }) => (
                <Typography>{content} - {format(new Date(created_at), 'dd/MM/yyyy pp')} ({timezone})</Typography>
            ))}
        </Box>
    );
};

export default AppointmentNotes;