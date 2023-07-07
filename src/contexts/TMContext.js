import React, { createContext, useContext, useState } from 'react';

const initialState = {
    api: null,
    projects: {},
    labels: {},
    filter: {}
}

const TMContext = createContext();
const TMUpdateContext = createContext();

const useTMContext = () => {
    return createContext(TMContext);
}

const useTMUpdateContext = () => {
    return createContext(TMUpdateContext);
}

const TMProvider = ({ children }) => {
    const [ session, setSession ] = useState(initialState);

    function handleSession(args) {
        if (args.api)
            setSession({ ...session, api: args.api });
        if (args.projects)
            setSession({ ...session, projects: args.projects });
        if (args.labels)
            setSession({ ...session, labels: args.labels });
        if (args.filter)
            setSession({ ...session, filter: args.filter });
    }

    return (
        <TMContext.Provider value={session}>
            <TMUpdateContext.Provider value={handleSession}>
                {children}
            </TMUpdateContext.Provider>
        </TMContext.Provider>
    )
}

export { useTMContext, useTMUpdateContext, TMProvider }