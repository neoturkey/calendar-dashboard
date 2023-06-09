import EventList from './EventList';
import { Box, Typography } from '@mui/material';
import ClockView from './ClockView';
import { useDataManager } from './DataManager';
import CakeIcon from '@mui/icons-material/Cake';

import dayjs from 'dayjs';
import _ from 'lodash';

function groupEventsForTwoDayOutlook(events) {
    if (!events) return;

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

function upcomingEvents(events) {
    const futureStart = dayjs().add(2, 'day').startOf('day');

    const regularEvents = [
        'Athletics',
        'Dance',
        'Football',
        'Gymnastics',
        'Lions - Training',
        'Piano',
        'Rounders',
        'Stage School',
        'Swimming',
        'Tennis',
    ];

    return (
        events &&
        _.filter(events, (event) => {
            if (event.startTimestamp.isBefore(futureStart)) return false;
            if (_.includes(regularEvents, event.subject)) return false;
            return true;
        })
    );
}

export default function DashboardView() {
    const { birthdays, events, eventsForGroup } = useDataManager();

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
                gridTemplateRows: '1fr '.repeat(6),
                gap: 2,
            }}
        >
            <EventList
                sx={{
                    gridRow: '1 / 4',
                }}
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Erin', { maxTimestamp: twoDayLimit })
                )}
                title="Erin"
                colorScheme="#ef6aef"
            />
            <EventList
                sx={{
                    gridRow: '1 / 4',
                }}
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Max', { maxTimestamp: twoDayLimit })
                )}
                title="Max"
                colorScheme="#fa2314"
            />
            <EventList
                sx={{
                    gridRow: '1 / 4',
                }}
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Gus', { maxTimestamp: twoDayLimit })
                )}
                title="Gus"
                colorScheme="#0abf1c"
            />
            <EventList
                sx={{
                    gridRow: '1 / 4',
                }}
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('Imi', { maxTimestamp: twoDayLimit })
                )}
                title="Imi"
                colorScheme="#0aaabf"
            />
            <EventList
                sx={{
                    gridRow: '1 / 4',
                }}
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup('James', { maxTimestamp: twoDayLimit })
                )}
                title="James"
            />
            <EventList
                sx={{
                    gridRow: '1 / 4',
                }}
                title="Family"
                eventGroups={groupEventsForTwoDayOutlook(
                    eventsForGroup(undefined, { maxTimestamp: twoDayLimit })
                )}
                colorScheme="#bf670a"
            />
            <EventList
                sx={{
                    gridColumn: '1 / 3',
                    gridRow: '4 / 7',
                }}
                title="This Weekend"
                events={eventsForWeekend(events)}
                showAvatars={true}
                showDay={true}
                colorScheme="#770abf"
            />
            <EventList
                sx={{
                    gridColumn: '3 / 6',
                    gridRow: '4 / 6',
                }}
                title="Upcoming Special Events"
                events={upcomingEvents(events)}
                showAvatars={true}
                showDay={true}
                showDate={true}
                colorScheme="#770abf"
                columns={2}
            />
            <EventList
                sx={{
                    gridColumn: '6',
                    gridRow: '4 / 6',
                }}
                title={
                    <Typography variant="h5">
                        <CakeIcon /> Birthdays <CakeIcon />
                    </Typography>
                }
                events={birthdays}
                showDay={true}
                showDate={true}
                colorScheme="#770abf"
            />
            <ClockView
                sx={{
                    gridColumn: '3 / 7',
                    gridRow: '6',
                    backgroundColor: '#bf670a',
                    color: 'white',
                }}
            />
        </Box>
    );
}
