import { useTMContext } from '../contexts/TMContext';

function ProjectsView() {
    const { projects, setFilter } = useTMContext();

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