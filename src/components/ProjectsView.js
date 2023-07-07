import { useContext } from 'react';
import { TMContext } from '../contexts/TMContext';

function ProjectsView() {
    const { context, setContext } = useContext(TMContext);

    function handleFilter(projectId) {
        setContext({ ...context, filter: {project: projectId} });
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