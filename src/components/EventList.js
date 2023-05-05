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

function EventItem({ event, showAvatars }) {
    const start = event.startTimestamp;

    const overdue =
        event.type === 'reminder' && start.isBefore(dayjs().startOf('day'));

    const dateFormat = overdue ? 'ddd DD/MM HH:mm' : 'ddd HH:mm';

    return (
        <ListItem secondaryAction={overdue && <WarningAmberIcon />}>
            {showAvatars && event.groups && event.groups.length > 0 && (
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
                secondary={start.format(dateFormat)}
            />
        </ListItem>
    );
}

export default function EventList({ sx, title, events, showAvatars }) {
    return (
        <Card sx={sx}>
            <CardHeader
                sx={{
                    textAlign: 'center',
                    backgroundColor: 'black',
                    color: 'white',
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
