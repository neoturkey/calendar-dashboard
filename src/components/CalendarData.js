import React from 'react';
import dayjs from 'dayjs';

import { useGapi } from './GAPI';
import { list_reminders } from './reminders';

import _ from 'lodash';

const calendarID = 'family11306879740916668579@group.calendar.google.com';

const allowedGroups = ['Erin', 'Max'];
function processTitleForSubjects(title) {
    const groupPrefixMatch = title.match(/^([^-]*)-/);
    if (groupPrefixMatch) {
        const prefixes = groupPrefixMatch[1].split(',').map((s) => s.trim());

        if (_.every(prefixes, (prefix) => _.includes(allowedGroups, prefix))) {
            return {
                groups: prefixes,
                subject: title.substring(groupPrefixMatch[0].length).trim(),
            };
        }
    }
}

const CalendarDataContext = React.createContext();

const CalendarDataProvider = (props) => {
    const { gapiClient, gapiClientInitialised, gapiClientSignedIn } = useGapi();

    const [events, setEvents] = React.useState();
    const [reminders, setReminders] = React.useState();
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

            const processedEvents = _.map(resp.result.items, (item) => {
                item.groups = []; // Default - will be overridden if appropriate

                const groupDetails = processTitleForSubjects(item.summary);
                if (groupDetails) {
                    item.groups = groupDetails.groups;
                    item.subject = groupDetails.subject;
                }

                item.startTimestamp = dayjs(
                    item.start.dateTime || item.start.date
                );
                item.endTimestamp = dayjs(item.end.dateTime || item.end.date);

                return item;
            });

            setEvents(processedEvents);
        }
        fetchEvents();
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    React.useEffect(() => {
        if (!gapiClientInitialised || !gapiClientSignedIn === undefined) return;

        if (!gapiClientSignedIn) {
            return;
        }

        const ar = gapiClient.auth2
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse();
        console.log('AR', ar);

        list_reminders(
            100,
            gapiClient.auth2
                .getAuthInstance()
                .currentUser.get()
                .getAuthResponse().access_token,
            function (remindersResp) {
                const processedReminders = _(remindersResp)
                    .map((item) => {
                        const groupDetails = processTitleForSubjects(
                            item.title
                        );
                        if (groupDetails) {
                            item.groups = groupDetails.groups;
                            item.subject = groupDetails.subject;
                        }
                        item.summary = item.title;
                        return item;
                    })
                    .filter((reminder) => !reminder.done)
                    .value();

                setReminders(processedReminders);
            }
        );

        console.log('Fetch reminders');
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    return (
        <CalendarDataContext.Provider value={{ events, reminders }}>
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
