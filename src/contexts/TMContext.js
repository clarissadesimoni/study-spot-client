import React, { useState } from 'react';

const TMApiContext = React.createContext(null);

function TMApiContextProvider({ children }) {
    const [ api, setApi ] = useState(null);
    const contextValue = {
        api,
        setApi
    }
    return (
        <TMApiContext.Provider value={contextValue}>{children}</TMApiContext.Provider>
    );
}

const TMProjectsContext = React.createContext(null);

function TMProjectsContextProvider({ children }) {
    const [ projects, setProjects ] = useState({});
    const contextValue = {
        projects,
        setProjects
    }
    return (
        <TMProjectsContextProvider.Provider value={contextValue}>{children}</TMProjectsContextProvider.Provider>
    );
}

const TMLabelsContext = React.createContext(null);

function TMLabelsContextProvider({ children }) {
    const [ labels, setLabels ] = useState({});
    const contextValue = {
        labels,
        setLabels
    }
    return (
        <TMLabelsContextProvider.Provider value={contextValue}>{children}</TMLabelsContextProvider.Provider>
    );
}

const TMFilterContext = React.createContext(null);

function TMFilterContextProvider({ children }) {
    const [ filter, setFilter ] = useState({});
    const contextValue = {
        filter,
        setFilter
    }
    return (
        <TMFilterContextProvider.Provider value={contextValue}>{children}</TMFilterContextProvider.Provider>
    );
}

export { TMApiContext, TMApiContextProvider, TMProjectsContext, TMProjectsContextProvider, TMLabelsContext, TMLabelsContextProvider, TMFilterContext, TMFilterContextProvider}