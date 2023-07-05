function TodoistProjectsView({ projects, filterFunc }) {

    async function handleFilter(projectId) {
        filterFunc({project: projectId});
    }

    return (
        <>
        {
            projects.keys().map(p => <><button onClick={() => handleFilter(p)}>{projects[p]}</button><p /></>)
        }
        </>
    )
}

export default TodoistProjectsView;