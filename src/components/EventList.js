// import React from 'react';

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

function EventItem({ event, showAvatars }) {
    const start = new Date(event.start.dateTime || event.start.date);

    const dateSettings = {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
    };

    return (
        <ListItem>
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
                secondary={start.toLocaleDateString('en-GB', dateSettings)}
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
