import React from 'react';
import Select from 'react-select';
import { TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function TodoistLabelsView() {
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(labelId) {
        setFilter({ ...filter, labelId: labelId });
    }

    try {
        return (
            <>
            {
                labels ? (
                    <div className='select tm-select'>
                        <Select options={Object.entries(labels).map(([k, v]) => {
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
    } catch(error) {
        console.log(error);
        return <>TodoistLabelsView</>;
    }
}

export default TodoistLabelsView;