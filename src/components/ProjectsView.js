import { useContext } from 'react';
import { TMProjectsContext, TMFilterContext } from '../contexts/TMContext';

function ProjectsView() {
    const { projects, setProjects } = useContext(TMProjectsContext);
    const { filter, setFilter } = useContext(TMFilterContext);

    function handleFilter(projectId) {
        setFilter({project: projectId});
    }

    return (
        <>
        {
            projects.keys().map(p => <><button onClick={() => handleFilter(p)}>{projects[p]}</button><p /></>)
        }
        </>
    )
}

export default ProjectsView;