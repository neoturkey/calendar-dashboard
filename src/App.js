import React from 'react';

import { useGapi, withGapi } from './components/GAPI';

import logo from './logo.svg';
import './App.css';

function App() {
    const test = useGapi();
    console.log('Test', test);

    // const calendarID = 'family11306879740916668579@group.calendar.google.com';

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload. 2
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default withGapi(App, {
    apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
    clientId: process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID,
});
