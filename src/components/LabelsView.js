function LabelsView({ labels, filterFunc}) {

    async function handleFilter(label) {
        console.log('change filter');
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