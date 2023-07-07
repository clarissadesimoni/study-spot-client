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

export { useTMContext, TMProvider }