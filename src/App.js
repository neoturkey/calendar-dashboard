import React from 'react';

import { useGapi, withGapi } from './components/GAPI';
import { useDataManager, withDataManager } from './components/DataManager';
import { withTimeManager } from './components/TimeManager';
import EventList from './components/EventList';
import WelcomeScreen from './components/WelcomeScreen';

import dayjs from 'dayjs';
import _ from 'lodash';
import { Box } from '@mui/material';

function groupEventsForTwoDayOutlook(events) {
    const today = {
        name: 'Today',
        events: [],
    };
    const tomorrow = {
        name: 'Tomorrow',
        events: [],
    };

    const endOfToday = dayjs().endOf('day');

    _.each(events, (e) => {
        if (endOfToday.isBefore(e.startTimestamp)) tomorrow.events.push(e);
        else today.events.push(e);
    });

    return [today, tomorrow];
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

    const twoDayLimit = dayjs().startOf('day').add(2, 'day');

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
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Erin', { maxTimestamp: twoDayLimit })
                )}
                title="Erin"
                colorScheme="#ef6aef"
            />
            <EventList
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Max', { maxTimestamp: twoDayLimit })
                )}
                title="Max"
            />
            <EventList
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Gus', { maxTimestamp: twoDayLimit })
                )}
                title="Gus"
            />
            <EventList
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Imi', { maxTimestamp: twoDayLimit })
                )}
                title="Imi"
            />
            <EventList
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('James', { maxTimestamp: twoDayLimit })
                )}
                title="James"
            />
            <EventList
                title="Family"
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup(undefined, { maxTimestamp: twoDayLimit })
                )}
            />
            <EventList
                sx={{
                    gridColumn: '1 / 3',
                }}
                title="This Weekend"
                events={eventsForWeekend(events)}
                showAvatars={true}
                showDay={true}
            />
        </Box>
    );
}

export default _.flowRight([
    withTimeManager,
    _.partial(withGapi, _, {
        apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID,
    }),
    withDataManager,
])(App);
