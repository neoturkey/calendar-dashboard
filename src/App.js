import React from 'react';

import { useGapi, withGapi } from './components/GAPI';
import { withDataManager } from './components/DataManager';
import { withTimeManager } from './components/TimeManager';

import WelcomeScreen from './components/WelcomeScreen';

import _ from 'lodash';
import DashboardView from './components/DashboardView';

function App() {
    const { gapiClientSignedIn } = useGapi();

    if (gapiClientSignedIn === undefined) {
        // TODO - Loading screen
        return null;
    }

    if (!gapiClientSignedIn) {
        // TODO - Welcome screen with signin Button
        return <WelcomeScreen />;
    }

    return <DashboardView />;
}

export default _.flowRight([
    withTimeManager,
    _.partial(withGapi, _, {
        apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID,
    }),
    withDataManager,
])(App);
