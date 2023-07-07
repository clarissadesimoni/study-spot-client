import { useTMContext } from '../contexts/TMContext';

function LabelsView() {
    const { labels, setFilter } = useTMContext();

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