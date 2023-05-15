import dayjs from 'dayjs';
import React from 'react';

const TimeManagerContext = React.createContext();

const TimeManagerProvider = (props) => {
    const [currentTime, setCurrentTime] = React.useState(dayjs());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <TimeManagerContext.Provider value={{ currentTime }}>
            {props.children}
        </TimeManagerContext.Provider>
    );
};

export const withTimeManager = (InnerComponent, withOpts = {}) => {
    const TimeManagerHOC = (props) => (
        <TimeManagerProvider {...withOpts}>
            <InnerComponent {...props} />
        </TimeManagerProvider>
    );
    return TimeManagerHOC;
};

export const useTimeManager = () => {
    const context = React.useContext(TimeManagerContext);
    if (context === undefined || context === null) {
        throw new Error('useTimeManager must be called within withTimeManager');
    }
    return context;
};
