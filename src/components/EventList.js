// import React from 'react';
import dayjs from 'dayjs';

import {
    Avatar,
    Badge,
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

function EventItem({ debug, sx, event, showAvatars, showDate, showDay }) {
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
        overdue || showDate ? 'DD/MM' : '',
        !event.allDay ? 'HH:mm' : '',
    ]);

    const dateFormat = dateFormatParts.length
        ? dateFormatParts.join(' ').trim()
        : undefined;

    let eventDate;
    if (dateFormat) {
        eventDate = start && start.format(dateFormat);
        if (
            event.endTimestamp &&
            !event.allDay &&
            event.startTimestamp !== event.endTimestamp
        )
            eventDate += event.endTimestamp.format(' - HH:mm');
    }

    const displayAvatar =
        showAvatars && event.groups && event.groups.length > 0;
    let ThisAvatar;
    if (displayAvatar) {
        if (event.groups.length > 1) {
            ThisAvatar = (
                <Badge
                    badgeContent={`+${event.groups.length - 1}`}
                    color="badge"
                >
                    <Avatar>{event.groups[0][0]}</Avatar>
                </Badge>
            );
        } else {
            ThisAvatar = <Avatar>{event.groups[0][0]}</Avatar>;
        }
    }

    let styleOverrides = {};
    let StatusIcon;

    if (done) {
        _.extend(styleOverrides, {
            opacity: 0.5,
            textDecoration: 'line-through #888',
        });
        if (_.includes(['task', 'reminder'], event.type)) StatusIcon = DoneIcon;
    } else if (overdue) {
        StatusIcon = WarningAmberIcon;
    }

    return (
        <ListItem sx={sx} secondaryAction={StatusIcon && <StatusIcon />}>
            {displayAvatar && <ListItemAvatar>{ThisAvatar}</ListItemAvatar>}
            <ListItemText
                sx={styleOverrides}
                primary={event.subject || event.summary}
                secondary={eventDate}
                inset={showAvatars && !displayAvatar}
            />
        </ListItem>
    );
}

function ListOfEvents({
    debug,
    columns,
    events,
    showAvatars,
    showDate,
    showDay,
}) {
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

    const listStyle = {};
    const listItemStyle = {};
    if (columns > 1) {
        _.extend(listStyle, {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        });

        const cellWidth = {
            2: '50%',
            3: '33.3%',
        }[columns];
        _.extend(listItemStyle, {
            width: cellWidth,
        });
    }

    return (
        <List sx={listStyle} dense={true}>
            {events.map((event) => (
                <EventItem
                    key={event.id}
                    sx={listItemStyle}
                    debug={debug}
                    event={event}
                    showAvatars={showAvatars}
                    showDate={showDate}
                    showDay={showDay}
                />
            ))}
        </List>
    );
}

export default function EventList({
    sx,
    title,
    columns = 1,
    debug,
    events,
    eventGroups,
    showAvatars,
    showDate,
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
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#0C0D0C',
                    color: 'white',
                }}
            >
                {events && (
                    <ListOfEvents
                        debug={debug}
                        events={events}
                        columns={columns}
                        showAvatars={showAvatars}
                        showDate={showDate}
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
                                <Typography
                                    sx={{ borderBottom: 'solid 1px' }}
                                    variant="h6"
                                >
                                    {eventGroup.name}
                                </Typography>
                                <ListOfEvents
                                    debug={debug}
                                    events={eventGroup.events}
                                    showAvatars={showAvatars}
                                    showDate={showDate}
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
