function TodoistLabelsView({ labels, filterFunc }) {

    async function handleFilter(label) {
        filterFunc({label: label});
    }

    return (
        <>
        {
            Object.keys(labels).map(l => <><button onClick={() => handleFilter(l)}>{labels[l]}</button><p /></>)
        }
        </>
    )
}

export default TodoistLabelsView;