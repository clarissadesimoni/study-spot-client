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
        <TMProjectsContext.Provider value={contextValue}>{children}</TMProjectsContext.Provider>
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
        <TMLabelsContext.Provider value={contextValue}>{children}</TMLabelsContext.Provider>
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
        <TMFilterContext.Provider value={contextValue}>{children}</TMFilterContext.Provider>
    );
}

export { TMApiContext, TMApiContextProvider, TMProjectsContext, TMProjectsContextProvider, TMLabelsContext, TMLabelsContextProvider, TMFilterContext, TMFilterContextProvider}