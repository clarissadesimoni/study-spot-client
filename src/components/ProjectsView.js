import { useContext } from 'react';
import { useTMContext, useTMUpdateContext } from '../contexts/TMContext';

function ProjectsView() {
    const context = useTMContext();
    const updateContext = useTMUpdateContext();

    function handleFilter(projectId) {
        updateContext({ ...context, filter: {project: projectId} });
    }

    return (
        <>
        {
            context.projects.keys().map(p => <><button onClick={() => handleFilter(p)}>{context.projects[p]}</button><p /></>)
        }
        </>
    )
}

export default ProjectsView;