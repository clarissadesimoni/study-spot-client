function TodoistLabelsView({ labels, filterFunc }) {

    async function handleFilter(label) {
        filterFunc({label: label});
    }

    return (
        <>
        {
            labels.keys().map(l => <><button onClick={() => handleFilter(l)}>{labels[l]}</button><p /></>)
        }
        </>
    )
}

export default TodoistLabelsView;