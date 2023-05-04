import React from 'react';

import { withGapi } from './components/GAPI';
import { withCalendarData } from './components/CalendarData';
import EventList from './components/EventList';

import _ from 'lodash';
import { Box } from '@mui/material';

function App() {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                padding: 2,
                boxSizing: 'border-box',

                backgroundColor: 'purple',
                display: 'grid',
                gridTemplateColumns: '1fr '.repeat(6),
                gridTemplateRows: '1fr '.repeat(2),
                gap: 2,
            }}
        >
            <EventList group="Erin" />
            <EventList group="Max" />
            <EventList group="Gus" />
            <EventList group="Imi" />
            <EventList group="James" />
            <EventList group="Family" />
        </Box>
    );
}

export default _.flowRight([
    _.partial(withGapi, _, {
        apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID,
    }),
    withCalendarData,
])(App);
