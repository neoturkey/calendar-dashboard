// import React from 'react';
import dayjs from 'dayjs';

import {
    Avatar,
    AvatarGroup,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
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
                inset={!displayAvatar}
            />
        </ListItem>
    );
}

export default function EventList({
    sx,
    title,
    events,
    showAvatars,
    colorScheme = '#000000',
}) {
    const textColor = getContrastColor(colorScheme);

    return (
        <Card sx={{ borderColor: 'red', ...sx }}>
            <CardHeader
                sx={{
                    textAlign: 'center',
                    backgroundColor: colorScheme,
                    color: textColor,
                }}
                title={title}
            />
            <CardContent>
                <List>
                    {events &&
                        events.map((event) => (
                            <EventItem
                                key={event.id}
                                event={event}
                                showAvatars={showAvatars}
                            />
                        ))}
                </List>
            </CardContent>
        </Card>
    );
}
