import React from 'react';
import { TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function LabelsView() {
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);

    function handleFilter(labelId) {
        setFilter({labelId: labelId});
    }

    try {
        return (
            <>
            {
                labels ? Object.keys(labels).map(l => <><button onClick={() => handleFilter(l)}>{labels[l]}</button><p /></>) : null
            }
            </>
        )
    } catch(error) {
        console.log(error);
        return <>LabelsView</>;
    }
}

export default LabelsView;