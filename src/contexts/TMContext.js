/* import React, { createContext, useContext, useState } from 'react';

const initialState = {
    api: null,
    projects: {},
    labels: {},
    filter: {}
}

const TMContext = createContext();

const useTMContext = () => {
    return createContext(TMContext);
}

const TMProvider = ({ children }) => {
    const [ api, setApi ] = useState(null);
    const [ projects, setProjects ] = useState({});
    const [ labels, setLabels ] = useState({});
    const [ filter, setFilter ] = useState({});

    return (
        <TMContext.Provider value={{ api, setApi, projects, setProjects, labels, setLabels, filter, setFilter }}>
            {children}
        </TMContext.Provider>
    )
}

export { useTMContext, TMProvider } */

import { createContext, useState } from 'react';

export const TMApiContext = createContext(null);

export function TMApiContextProvider({ children }) {
    const [ api, setApi ] = useState(null);
    const contextValue = {
        api,
        setApi
    }
    return (
        <TMApiContext.Provider value={contextValue}>{children}</TMApiContext.Provider>
    );
}

export const TMProjectsContext = createContext(null);

export function TMProjectsContextProvider({ children }) {
    const [ projects, setProjects ] = useState({});
    const contextValue = {
        projects,
        setProjects
    }
    return (
        <TMProjectsContextProvider.Provider value={contextValue}>{children}</TMProjectsContextProvider.Provider>
    );
}

export const TMLabelsContext = createContext(null);

export function TMLabelsContextProvider({ children }) {
    const [ labels, setLabels ] = useState({});
    const contextValue = {
        labels,
        setLabels
    }
    return (
        <TMLabelsContextProvider.Provider value={contextValue}>{children}</TMLabelsContextProvider.Provider>
    );
}

export const TMFilterContext = createContext(null);

export function TMFilterContextProvider({ children }) {
    const [ filter, setFilter ] = useState({});
    const contextValue = {
        filter,
        setFilter
    }
    return (
        <TMFilterContextProvider.Provider value={contextValue}>{children}</TMFilterContextProvider.Provider>
    );
}