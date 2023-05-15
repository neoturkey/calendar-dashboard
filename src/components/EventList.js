// import React from 'react';
import dayjs from 'dayjs';

import {
    Avatar,
    AvatarGroup,
    Box,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DoneIcon from '@mui/icons-material/Done';

import { getContrastColor } from '../lib/colors';

import _ from 'lodash';

function EventItem({ debug, event, showAvatars, showDay }) {
    const start = event.startTimestamp;

    if (debug) {
        console.log('EVENT', event.type, event.subject, event);
    }

    const done = !!event.done;

    // TODO - Using the timeManager, even just for current day, will cause a re-render.  Can probably fixed with appropriate memoization?
    const overdue =
        start &&
        _.includes(['reminder', 'task'], event.type) &&
        start.isBefore(dayjs().startOf('day'));

    const dateFormatParts = _.compact([
        overdue || showDay ? 'ddd' : '',
        overdue ? 'DD/MM' : '',
        !event.allDay ? 'HH:mm' : '',
    ]);

    const dateFormat = dateFormatParts.length
        ? dateFormatParts.join(' ').trim()
        : undefined;

    let eventDate;
    if (dateFormat) {
        eventDate = start && start.format(dateFormat);
        if (event.endTimestamp && event.startTimestamp !== event.endTimestamp)
            eventDate += event.endTimestamp.format(' - HH:mm');
    }

    const displayAvatar =
        showAvatars && event.groups && event.groups.length > 0;

    let textOpacity = 1.0;
    let StatusIcon;

    if (done) {
        textOpacity = 0.5;
        if (_.includes(['task', 'reminder'], event.type)) StatusIcon = DoneIcon;
    } else if (overdue) {
        StatusIcon = WarningAmberIcon;
    }

    return (
        <ListItem secondaryAction={StatusIcon && <StatusIcon />}>
            {displayAvatar && (
                <ListItemAvatar>
                    <AvatarGroup>
                        {event.groups.map((group) => (
                            <Avatar key={group}>{group[0]}</Avatar>
                        ))}
                    </AvatarGroup>
                </ListItemAvatar>
            )}
            <ListItemText
                sx={{
                    opacity: textOpacity,
                }}
                primary={event.subject || event.summary}
                secondary={eventDate}
                inset={showAvatars && !displayAvatar}
            />
        </ListItem>
    );
}

function ListOfEvents({ debug, events, showAvatars, showDay }) {
    if (!events || events.length === 0) {
        return (
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontStyle: 'italic' }}>
                    Nothing special
                </Typography>
            </Box>
        );
    }

    return (
        <List>
            {events.map((event) => (
                <EventItem
                    key={event.id}
                    debug={debug}
                    event={event}
                    showAvatars={showAvatars}
                    showDay={showDay}
                />
            ))}
        </List>
    );
}

export default function EventList({
    sx,
    title,
    debug,
    events,
    eventGroups,
    showAvatars,
    showDay,
    colorScheme = '#000000',
}) {
    const textColor = getContrastColor(colorScheme);

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
            <CardHeader
                sx={{
                    textAlign: 'center',
                    backgroundColor: colorScheme,
                    color: textColor,
                }}
                title={title}
            />
            <CardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                {events && (
                    <ListOfEvents
                        debug={debug}
                        events={events}
                        showAvatars={showAvatars}
                        showDay={showDay}
                    />
                )}
                {eventGroups && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateRows: '1fr '.repeat(eventGroups.length),
                            flexGrow: 1,
                        }}
                    >
                        {eventGroups.map((eventGroup) => (
                            <Box
                                key={eventGroup.name}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography>{eventGroup.name}</Typography>
                                <ListOfEvents
                                    debug={debug}
                                    events={eventGroup.events}
                                    showAvatars={showAvatars}
                                    showDay={showDay}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
