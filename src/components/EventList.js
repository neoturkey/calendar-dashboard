// import React from 'react';

import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';

function EventItem({ event, group }) {
    const start = new Date(event.start.dateTime || event.start.date);

    const dateSettings = {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
    };

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>{group[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={event.subject || event.summary}
                secondary={start.toLocaleDateString('en-GB', dateSettings)}
            />
        </ListItem>
    );
}

export default function EventList({ group, events }) {
    return (
        <Card>
            <CardHeader title={group} />
            <CardContent>
                <List>
                    {events &&
                        events.map((event) => (
                            <EventItem
                                key={event.id}
                                event={event}
                                group={group}
                            />
                        ))}
                </List>
            </CardContent>
        </Card>
    );
}
