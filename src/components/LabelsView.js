function LabelsView({ labels, filterFunc }) {

    function handleFilter(label) {
        filterFunc({label: label});
    }

    return (
        <>
        {
            labels.map(l => <><button onClick={() => handleFilter(l.id)}>{l.name}</button><p /></>)
        }
        </>
    )
}

export default LabelsView;