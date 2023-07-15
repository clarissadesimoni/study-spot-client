import React from 'react';
import Select from 'react-select';
import { TMProjectsContext, TMFilterContext } from '../contexts/TMContext';

function TodoistProjectsView() {
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(projectId) {
        setFilter({ ...filter, projectId: projectId });
    }

    try {
        return (
            <>
            {
                projects ? (
                    <div className='select tm-select'>
                        <Select options={Object.entries(projects).map(([k, v]) => {
                            return {
                                value: k,
                                label: v
                            }
                        })} defaultValue={''} onChange={selected => selected.value ? handleFilter(selected.value) : handleFilter(null)} isClearable={true} isSearchable={true} />
                    </div>
                ) : null
            }
            </>
        )
    } catch (error) {
        console.log(error);
        return <>TodoistProjectsView</>;
    }
}

export default TodoistProjectsView;