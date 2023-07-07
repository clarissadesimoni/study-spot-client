import React from 'react';
import { TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function LabelsView() {
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(labelId) {
        setFilter({labelId: labelId});
    }

    return (
        <>
        {
            labels.keys().map(l => <><button onClick={() => handleFilter(l)}>{labels[l]}</button><p /></>)
        }
        </>
    )
}

export default LabelsView;