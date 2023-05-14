import React from 'react';

import { useGapi, withGapi } from './components/GAPI';
import { useDataManager, withDataManager } from './components/DataManager';
import EventList from './components/EventList';
import WelcomeScreen from './components/WelcomeScreen';

import dayjs from 'dayjs';
import _ from 'lodash';
import { Box } from '@mui/material';

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
    const { events, eventsForGroup } = useDataManager();
    const { gapiClientSignedIn } = useGapi();

    if (gapiClientSignedIn === undefined) {
        // TODO - Loading screen
        return null;
    }

    if (!gapiClientSignedIn) {
        // TODO - Welcome screen with signin Button
        return <WelcomeScreen />;
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                padding: 2,
                boxSizing: 'border-box',

                // backgroundColor: 'purple',
                display: 'grid',
                gridTemplateColumns: '1fr '.repeat(6),
                gridTemplateRows: '1fr '.repeat(2),
                gap: 2,
            }}
        >
            <EventList
                events={eventsForGroup('Erin')}
                title="Erin"
                colorScheme="#ef6aef"
            />
            <EventList events={eventsForGroup('Max')} title="Max" />
            <EventList events={eventsForGroup('Gus')} title="Gus" />
            <EventList events={eventsForGroup('Imi')} title="Imi" />
            <EventList events={eventsForGroup('James')} title="James" />
            <EventList
                title="Family"
                events={eventsForGroup(undefined, {
                    maxTimestamp: dayjs().startOf('day').add(2, 'day'),
                })}
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
    withDataManager,
])(App);
