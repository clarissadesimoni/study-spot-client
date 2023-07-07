import { useContext } from 'react';
import { TMContext } from '../contexts/TMContext';

function LabelsView() {
    const { context, setContext } = useContext(TMContext);

    function handleFilter(labelId) {
        setContext({ ...context, filter: {labelId: labelId} });
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