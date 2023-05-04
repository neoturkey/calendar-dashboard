import React from 'react';
import dayjs from 'dayjs';

import { useGapi } from './GAPI';

import _ from 'lodash';

const calendarID = 'family11306879740916668579@group.calendar.google.com';

const CalendarDataContext = React.createContext();

const CalendarDataProvider = (props) => {
    const { gapiClient, gapiClientInitialised, gapiClientSignedIn } = useGapi();

    const [events, setEvents] = React.useState();
    // const [groupedEvents, setGroupedEvents] = React.useState();

    React.useEffect(() => {
        if (!gapiClientInitialised || gapiClientSignedIn === undefined) return;

        if (!gapiClientSignedIn) {
            setEvents();
            return;
        }

        async function fetchEvents() {
            const resp = await gapiClient.client.request({
                path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
                params: {
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: dayjs()
                        .startOf('day')
                        // .add(-1, 'day')
                        .toISOString(),
                    timeMax: dayjs()
                        .endOf('week')
                        .add(1, 'day')
                        // .add(3, 'day')
                        .toISOString(),
                },
            });

            const allowedGroups = ['Erin', 'Max'];
            const processedEvents = _.map(resp.result.items, (item) => {
                item.groups = []; // Default - will be overridden if appropriate
                const title = item.summary;
                const groupPrefixMatch = title.match(/^([^-]*)-/);
                console.log('GPM', groupPrefixMatch);

                if (groupPrefixMatch) {
                    const prefixes = groupPrefixMatch[1]
                        .split(',')
                        .map((s) => s.trim());

                    if (
                        _.every(prefixes, (prefix) =>
                            _.includes(allowedGroups, prefix)
                        )
                    ) {
                        item.groups = prefixes;
                        item.subject = item.summary
                            .substring(groupPrefixMatch[0].length)
                            .trim();
                    }
                }

                return item;
            });

            setEvents(processedEvents);
        }
        fetchEvents();
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    return (
        <CalendarDataContext.Provider value={{ events }}>
            {props.children}
        </CalendarDataContext.Provider>
    );
};

export const withCalendarData = (InnerComponent, withOpts = {}) => {
    const CalendarDataHOC = (props) => (
        <CalendarDataProvider {...withOpts}>
            <InnerComponent {...props} />
        </CalendarDataProvider>
    );
    return CalendarDataHOC;
};

export const useCalendarData = () => {
    const context = React.useContext(CalendarDataContext);
    if (context === undefined || context === null) {
        throw new Error(
            'useCalendarData must be called within withCalendarData'
        );
    }
    return context;
};
