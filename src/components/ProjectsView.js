import React from 'react';
import Select from 'react-select';
import { TMProjectsContext, TMFilterContext } from '../contexts/TMContext';

function ProjectsView() {
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(projectId) {
        setFilter({projectId: projectId});
    }

    try {
        return (
            <>
            {
                projects ? (
                    <Select options={Object.entries(projects).map(([k, v]) => {
                        return {
                            value: k,
                            label: v
                        }
                    })} onChange={selected => handleFilter(selected.value)} />
                ) : null
            }
            </>
        )
    } catch (error) {
        console.log(error);
        return <>ProjectsView</>;
    }
}

export default ProjectsView;