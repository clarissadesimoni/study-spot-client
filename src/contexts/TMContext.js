import React, { useContext, useState } from 'react';

const initialState = {
    session: {
        api: null,
        projects: {},
        labels: {},
        filter: {}
    },
    getApi: () => this.session.api,
    getProjects: () => this.session.projects,
    getLabels: () => this.session.labels,
    getFilter: () => this.session.filter
}

const TMContext = useContext(initialState);

const TMProvider = ({ children }) => {
    const [ session, setSession ] = useState(initialState.session);
    return (
        <TMContext.Provider value={{session, setSession}}>
            {children}
        </TMContext.Provider>
    )
}

export { initialState, TMContext, TMProvider }