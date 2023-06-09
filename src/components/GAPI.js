import React from 'react';

import { gapi } from 'gapi-script';

const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    'https://tasks.googleapis.com/$discovery/rest?version=v1',
];
const SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/reminders',
    'https://www.googleapis.com/auth/tasks.readonly',
].join(' ');

const GapiContext = React.createContext();

const GapiProvider = (props) => {
    const [gapiClient, setGapiClient] = React.useState();
    const [gapiClientInitialised, setGapiClientInitialised] =
        React.useState(false);
    const [gapiClientSignedIn, setGapiClientSignedIn] = React.useState();

    function signIn() {
        if (!gapiClientInitialised) {
            console.error(
                'Attempting to signin before gapi client is initialised'
            );
            return;
        }

        gapiClient.auth2.getAuthInstance().signIn();
    }

    React.useEffect(() => {
        const run = async () => {
            await gapi.load('client', function () {
                gapi.client
                    .init({
                        apiKey: props.apiKey,
                        clientId: props.clientId,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES,
                    })
                    .then(async function () {
                        setGapiClientInitialised(true);
                        setGapiClient(gapi);

                        const gapiAuth = gapi.auth2.getAuthInstance();

                        gapiAuth.isSignedIn.listen(setGapiClientSignedIn);
                        setGapiClientSignedIn(gapiAuth.isSignedIn.get());
                    });
            });
        };
        run().catch((err) => {
            console.error('Error initialising GAPI Client', err);
        });
    }, []);

    return (
        <GapiContext.Provider
            value={{
                gapiClient,
                gapiClientInitialised,
                gapiClientSignedIn,
                gapiSignIn: signIn,
            }}
        >
            {props.children}
        </GapiContext.Provider>
    );
};

export const withGapi = (InnerComponent, withOpts = {}) => {
    const GapiHOC = (props) => (
        <GapiProvider {...withOpts}>
            <InnerComponent {...props} />
        </GapiProvider>
    );
    return GapiHOC;
};

export const useGapi = () => {
    const context = React.useContext(GapiContext);
    if (context === undefined || context === null) {
        throw new Error('useUserContext must be called within UserProvider');
    }
    return context;
};
