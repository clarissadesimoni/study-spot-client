import { useContext } from 'react';
import { useTMContext, useTMUpdateContext } from '../contexts/TMContext';

function LabelsView() {
    const context = useTMContext();
    const updateContext = useTMUpdateContext();

    function handleFilter(labelId) {
        updateContext({ ...context, filter: {labelId: labelId} });
    }

    return (
        <>
        {
            context.labels.keys().map(l => <><button onClick={() => handleFilter(l)}>{context.labels[l]}</button><p /></>)
        }
        </>
    )
}

export default LabelsView;