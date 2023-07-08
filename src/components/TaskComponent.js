import React, { useRef, useState } from 'react';
import { TMProjectsContext, TMLabelsContext } from '../contexts/TMContext';

function TaskComponent({ obj, editFunc, closeFunc, deleteFunc }) {
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const [isEditing, setIsEditing] = useState(false);
    var newName = useRef('');

    function handleEdit() {
        editFunc(obj.id, newName.current);
        setIsEditing(false);
    }

    function handleCheck() {
        closeFunc(obj.id);
    }

    function handleDelete() {
        deleteFunc(obj.id);
    }

    return (
        <>
            <input type="checkbox" onChange={handleCheck} />
            <text>{obj.name} - {projects[obj.projectId]} - {obj.due.toISOString()} - {obj.labels.reduce((acc, label) => acc + ', ' + labels[label])}</text>
            <button onClick={() => setIsEditing(true)}>Rinomina</button>
            {
                isEditing && (
                    <>
                        <input type='text' autoComplete='off' onChange={e => newName.current = e.target.value} />
                        <button onClick={handleEdit}>Invia</button>
                    </>
                )
            }
            <button onClick={handleDelete}>Rimuovi</button>
        </>
    )
}

export default TaskComponent;