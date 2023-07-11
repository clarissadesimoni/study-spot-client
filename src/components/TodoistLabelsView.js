import React from 'react';
import { TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function TodoistLabelsView() {
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(labelId) {
        setFilter({labelId: labelId});
    }

    try {
        return (
            <>
            {
                labels ? (
                    <Select options={Object.entries(labels).map(([k, v]) => {
                        return {
                            value: k,
                            label: v
                        }
                    })} onChange={selected => handleFilter(selected.value)} />
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