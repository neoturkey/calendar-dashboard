import React from 'react';

import { gapi } from 'gapi-script';

const DISCOVERY_DOC =
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES =
    'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/reminders';

const GapiContext = React.createContext();

const GapiProvider = (props) => {
    const [gapiClient, setGapiClient] = React.useState();
    const [gapiClientInitialised, setGapiClientInitialised] =
        React.useState(false);
    const [gapiClientSignedIn, setGapiClientSignedIn] = React.useState();

    React.useEffect(() => {
        const run = async () => {
            await gapi.load('client', function () {
                gapi.client
                    .init({
                        apiKey: props.apiKey,
                        clientId: props.clientId,
                        discoveryDocs: [DISCOVERY_DOC],
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
        run()
            .then(() => {
                console.log('Done');
            })
            .catch((err) => {
                console.error('GAPI Error', err);
            });
    }, []);

    return (
        <GapiContext.Provider
            value={{ gapiClient, gapiClientInitialised, gapiClientSignedIn }}
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
