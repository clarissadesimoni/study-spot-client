import React, { createContext, useContext, useState } from 'react';

const initialState = {
    api: null,
    projects: {},
    labels: {},
    filter: {}
}

const TMContext = createContext(initialState);

const TMProvider = ({ children }) => {
    const [ session, setSession ] = useState(initialState);
    return (
        <TMContext.Provider value={{session, setSession}}>
            {children}
        </TMContext.Provider>
    )
}

export { initialState, TMContext, TMProvider }