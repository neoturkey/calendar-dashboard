import React from 'react';
import dayjs from 'dayjs';

import { useGapi } from './GAPI';
import { list_reminders } from './reminders';

import _ from 'lodash';

const calendarID = 'family11306879740916668579@group.calendar.google.com';
const birthdayCalendarId =
    '7rkielkkcjuqcgngmfigm8sic8@group.calendar.google.com';
const tasklistID = 'RHB5eFVyRGI2dlRtS0lRVw';

const allowedGroups = ['Erin', 'Max', 'Gus', 'Imi', 'James'];
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

const DataManagerContext = React.createContext();

function processCalendarEvent(item) {
    item.groups = []; // Default - will be overridden if appropriate

    const groupDetails = processTitleForSubjects(item.summary);
    if (groupDetails) {
        item.groups = groupDetails.groups;
        item.subject = groupDetails.subject;
    } else {
        item.groups = [];
        item.subject = item.summary.trim();
    }

    item.type = 'calendarEvent';

    // If event has a start time, it'll be provided as start.dateTime, otherwise start.date will be provided
    item.startTimestamp = dayjs(item.start.dateTime || item.start.date);
    item.endTimestamp = dayjs(item.end.dateTime || item.end.date);
    item.allDay = !!item.start.date;

    // TODO - Using currentTime causes a re-render, perhaps refactor at some point
    // item.done = item.endTimestamp.isBefore(currentTime);
    item.done = item.endTimestamp.isBefore(dayjs());

    // TODO - If this will be done before the next fetch, perhaps run a timer?

    return item;
}

const DataManagerProvider = ({ children, fetchInterval }) => {
    const { gapiClient, gapiClientInitialised, gapiClientSignedIn } = useGapi();

    const [events, setEvents] = React.useState();
    const [birthdays, setBirthdays] = React.useState();
    const [reminders, setReminders] = React.useState();
    const [tasks, setTasks] = React.useState();

    const [dataInitialised, setDataInitialised] = React.useState({
        events: false,
        birthdays: false,
        reminders: false,
        tasks: false,
    });

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
                    timeMin: dayjs().startOf('day').toISOString(),
                    timeMax: dayjs().endOf('week').add(10, 'day').toISOString(),
                },
            });

            const processedEvents = _.map(
                resp.result.items,
                processCalendarEvent
            );

            setEvents(processedEvents);
            setDataInitialised((old) => ({ ...old, events: true }));
        }

        let intervalId;
        fetchEvents();
        if (fetchInterval) intervalId = setInterval(fetchEvents, fetchInterval);

        return () => {
            if (intervalId !== undefined) clearInterval(intervalId);
        };
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    React.useEffect(() => {
        if (!gapiClientInitialised || gapiClientSignedIn === undefined) return;

        if (!gapiClientSignedIn) {
            setEvents();
            return;
        }

        async function fetchEvents() {
            const resp = await gapiClient.client.request({
                path: `https://www.googleapis.com/calendar/v3/calendars/${birthdayCalendarId}/events`,
                params: {
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: dayjs().startOf('day').toISOString(),
                },
            });

            const processedEvents = _.map(
                resp.result.items,
                processCalendarEvent
            );

            setBirthdays(processedEvents);
            setDataInitialised((old) => ({ ...old, birthdays: true }));
        }

        let intervalId;
        fetchEvents();
        if (fetchInterval) intervalId = setInterval(fetchEvents, fetchInterval);

        return () => {
            if (intervalId !== undefined) clearInterval(intervalId);
        };
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    React.useEffect(() => {
        if (!gapiClientInitialised || gapiClientSignedIn === undefined) return;

        if (!gapiClientSignedIn) {
            setEvents();
            return;
        }

        async function fetchEvents() {
            // const respTaskLists = await gapiClient.client.tasks.tasklists.list({
            //     maxResults: 100,
            // });
            // console.log('TaskLists', respTaskLists);

            const today = dayjs().startOf('day');

            const resp = await gapiClient.client.tasks.tasks.list({
                maxResults: 100,
                showCompleted: true,
                showHidden: true,
                tasklist: tasklistID,
            });

            const processedTasks = _(resp.result.items)
                .filter((item) => {
                    if (
                        item.status === 'completed' &&
                        dayjs(item.completed).isBefore(today)
                    )
                        return false;

                    return true;
                })
                .map((item) => {
                    item.groups = []; // Default - will be overridden if appropriate

                    const groupDetails = processTitleForSubjects(item.title);
                    if (groupDetails) {
                        item.groups = groupDetails.groups;
                        item.subject = groupDetails.subject;
                    } else {
                        item.groups = [];
                        item.subject = item.title;
                    }

                    item.type = 'task';
                    if (item.due) {
                        item.startTimestamp = dayjs(item.due);
                        item.allDay = _.includes(
                            ['00:00', '01:00'],
                            item.startTimestamp.format('HH:mm')
                        );
                    }

                    item.done = item.status === 'completed';

                    return item;
                })
                .value();

            setTasks(processedTasks);
            setDataInitialised((old) => ({ ...old, tasks: true }));
        }

        let intervalId;
        fetchEvents();
        if (fetchInterval) intervalId = setInterval(fetchEvents, fetchInterval);

        return () => {
            if (intervalId !== undefined) clearInterval(intervalId);
        };
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    React.useEffect(() => {
        if (!gapiClientInitialised || !gapiClientSignedIn === undefined) return;

        if (!gapiClientSignedIn) {
            return;
        }

        function fetchEvents() {
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
                            } else {
                                item.groups = [];
                                item.subject = item.title;
                            }
                            item.type = 'reminder';
                            item.summary = item.title;

                            item.startTimestamp = dayjs(item.dt);
                            item.endTimestamp = item.startTimestamp;
                            item.allDay = _.includes(
                                ['00:00', '01:00'],
                                item.startTimestamp.format('HH:mm')
                            );

                            return item;
                        })
                        .filter((reminder) => !reminder.done)
                        .value();

                    setReminders(processedReminders);
                    setDataInitialised((old) => ({ ...old, reminders: true }));
                }
            );
        }

        let intervalId;
        fetchEvents();
        if (fetchInterval) intervalId = setInterval(fetchEvents, fetchInterval);

        return () => {
            if (intervalId !== undefined) clearInterval(intervalId);
        };
    }, [gapiClient, gapiClientInitialised, gapiClientSignedIn]);

    const eventsForGroup = (group, { maxTimestamp } = {}) => {
        if (dataInitialised.events !== true) return;
        if (dataInitialised.tasks !== true) return;
        if (dataInitialised.reminders !== true) return;

        const calendarEventsForGroup =
            events &&
            _.filter(events, (event) =>
                group !== undefined
                    ? _.includes(event.groups, group)
                    : event.groups.length === 0
            );

        const remindersForGroup =
            reminders &&
            _.filter(reminders, (reminder) =>
                group !== undefined
                    ? _.includes(reminder.groups, group)
                    : reminder.groups.length === 0
            );

        const tasksForGroup =
            tasks &&
            _.filter(tasks, (task) =>
                group !== undefined
                    ? _.includes(task.groups, group)
                    : task.groups.length === 0
            );

        const allEventsForGroup = _.filter(
            [
                ...(calendarEventsForGroup || []),
                ...(remindersForGroup || []),
                ...(tasksForGroup || []),
            ],
            (event) => {
                if (
                    maxTimestamp &&
                    event.startTimestamp &&
                    !event.startTimestamp.isBefore(maxTimestamp)
                )
                    return false;
                return true;
            }
        );

        return allEventsForGroup.sort((a, b) => {
            if (!a.startTimestamp & !b.startTimestamp) return 0;
            else if (
                !a.startTimestamp ||
                a.startTimestamp.isBefore(b.startTimestamp)
            )
                return -1;
            else if (
                !b.startTimestamp ||
                b.startTimestamp.isBefore(a.startTimestamp)
            )
                return 1;
            else return 0;
        });
    };

    return (
        <DataManagerContext.Provider
            value={{ birthdays, events, reminders, tasks, eventsForGroup }}
        >
            {children}
        </DataManagerContext.Provider>
    );
};

export const withDataManager = (InnerComponent, withOpts = {}) => {
    const DataManagerHOC = (props) => (
        <DataManagerProvider {...withOpts}>
            <InnerComponent {...props} />
        </DataManagerProvider>
    );
    return DataManagerHOC;
};

export const useDataManager = () => {
    const context = React.useContext(DataManagerContext);
    if (context === undefined || context === null) {
        throw new Error('useDataManager must be called within withDataManager');
    }
    return context;
};
