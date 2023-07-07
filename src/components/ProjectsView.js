function ProjectsView({ projects, filterFunc}) {

    function handleFilter(projectId) {
        filterFunc({project: projectId});
    }

    return (
        <>
        {
            projects.map(p => <><button onClick={() => handleFilter(p.id)}>{p.name}</button><p /></>)
        }
        </>
    )
}

export default ProjectsView;