import React from 'react';

import { withGapi } from './components/GAPI';
import { useCalendarData, withCalendarData } from './components/CalendarData';
import EventList from './components/EventList';

import dayjs from 'dayjs';
import _ from 'lodash';
import { Box } from '@mui/material';

function eventsForGroup(events, group) {
    const filteredEvents =
        events && _.filter(events, (event) => _.includes(event.groups, group));

    return {
        title: group,
        events: filteredEvents,
    };
}

function eventsForWeekend(events) {
    const weekendStart = dayjs().add(-1, 'day').startOf('week').add(6, 'day');
    const weekendEnd = weekendStart.endOf('day').add(1, 'day');

    return (
        events &&
        _.filter(events, (event) => {
            return (
                event.startTimestamp.isBefore(weekendEnd) &&
                weekendStart.isBefore(event.endTimestamp)
            );
        })
    );
}

function App() {
    const { events } = useCalendarData();

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
            <EventList {...eventsForGroup(events, 'Erin')} />
            <EventList {...eventsForGroup(events, 'Max')} />
            <EventList {...eventsForGroup(events, 'Gus')} />
            <EventList {...eventsForGroup(events, 'Imi')} />
            <EventList {...eventsForGroup(events, 'James')} />
            <EventList
                title="Family"
                events={
                    events &&
                    _.filter(events, (event) => event.groups.length === 0)
                }
            />
            <EventList
                sx={{
                    gridColumn: '1 / 3',
                }}
                title="This Weekend"
                events={eventsForWeekend(events)}
                showAvatars={true}
            />
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
