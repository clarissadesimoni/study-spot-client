import React from 'react';
import { TMProjectsContext, TMFilterContext } from '../contexts/TMContext';

function ProjectsView() {
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(projectId) {
        setFilter({project: projectId});
    }

    try {
        return (
            <>
            {
                projects ? projects.keys().map(p => <><button onClick={() => handleFilter(p)}>{projects[p]}</button><p /></>) : null
            }
            </>
        )
    } catch (error) {
        console.log(error);
        return <>ProjectsView</>;
    }
}

export default ProjectsView;