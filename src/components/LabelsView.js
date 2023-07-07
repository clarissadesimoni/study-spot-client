import { useContext } from 'react';
import { TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function LabelsView() {
    const { labels, setLabels } = useContext(TMLabelsContext);
    const { filter, setFilter } = useContext(TMFilterContext);

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