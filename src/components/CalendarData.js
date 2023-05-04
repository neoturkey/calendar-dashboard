import React from 'react';
import dayjs from 'dayjs';

import { useGapi } from './GAPI';

import _ from 'lodash';

const calendarID = 'family11306879740916668579@group.calendar.google.com';

const CalendarDataContext = React.createContext();

const CalendarDataProvider = (props) => {
    const { gapiClient, gapiClientInitialised, gapiClientSignedIn } = useGapi();

    const [allEvents, setAllEvents] = React.useState();
    const [groupedEvents, setGroupedEvents] = React.useState();

    React.useEffect(() => {
        if (!gapiClientInitialised || gapiClientSignedIn === undefined) return;

        if (!gapiClientSignedIn) {
            setAllEvents();
            return;
        }

        async function fetchEvents() {
            const resp = await gapiClient.client.request({
                path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
                params: {
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: dayjs().startOf('day').toISOString(),
                    timeMax: dayjs()
                        .endOf('week')
                        .add(1, 'day')
                        .add(3, 'day')
                        .toISOString(),
                },
            });
            setAllEvents(resp.result.items);

            const allowedGroups = ['Erin', 'Max'];
            const fallbackGroup = 'Family';
            const groups = {};
            _.each(resp.result.items, (item) => {
                const title = item.summary;
                const groupPrefixMatch = title.match(/^([^-]*)-/);

                let placed = false;
                if (groupPrefixMatch) {
                    const prefixes = groupPrefixMatch[1]
                        .split(',')
                        .map((s) => s.trim());
                    console.log('PF', prefixes);

                    if (
                        _.every(prefixes, (prefix) =>
                            _.includes(allowedGroups, prefix)
                        )
                    ) {
                        _.each(prefixes, (prefix) => {
                            if (!groups[prefix]) groups[prefix] = [];
                            groups[prefix].push(item);
                        });
                        placed = true;
                    }
                }

                if (!placed) {
                    if (!groups[fallbackGroup]) groups[fallbackGroup] = [];
                    groups[fallbackGroup].push(item);
                }
                // console.log('GP', title, groupPrefixMatch);
            });

            console.log('Groups', groups);
            setGroupedEvents(groups);
        }
        fetchEvents();
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    return (
        <CalendarDataContext.Provider value={{ allEvents, groupedEvents }}>
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
