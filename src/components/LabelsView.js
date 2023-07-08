import React from 'react';
import { TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function LabelsView() {
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(labelId) {
        setFilter({labelId: labelId});
    }

    console.log('re-rendering');
    console.log(projects);

    try {
        return (
            <>
            {
                labels ? labels.keys().map(l => <><button onClick={() => handleFilter(l)}>{labels[l]}</button><p /></>) : null
            }
            </>
        )
    } catch(error) {
        console.error(error);
        return <>LabelsView</>;
    }
}

export default LabelsView;