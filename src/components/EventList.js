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

import { getContrastColor } from '../lib/colors';

import _ from 'lodash';

function EventItem({ event, showAvatars }) {
    const start = event.startTimestamp;

    const overdue =
        start &&
        _.includes(['reminder', 'task'], event.type) &&
        start.isBefore(dayjs().startOf('day'));

    const dateFormat = overdue ? 'ddd DD/MM HH:mm' : 'ddd HH:mm';
    let eventDate = start && start.format(dateFormat);
    if (event.endTimestamp) eventDate += event.endTimestamp.format(' - HH:mm');

    const displayAvatar =
        showAvatars && event.groups && event.groups.length > 0;

    return (
        <ListItem secondaryAction={overdue && <WarningAmberIcon />}>
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
                primary={event.subject || event.summary}
                secondary={eventDate}
                inset={showAvatars && !displayAvatar}
            />
        </ListItem>
    );
}

function ListOfEvents({ events, showAvatars }) {
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
                    event={event}
                    showAvatars={showAvatars}
                />
            ))}
        </List>
    );
}

export default function EventList({
    sx,
    title,
    events,
    eventGroups,
    showAvatars,
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
                    <ListOfEvents events={events} showAvatars={showAvatars} />
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
                                    events={eventGroup.events}
                                    showAvatars={showAvatars}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
