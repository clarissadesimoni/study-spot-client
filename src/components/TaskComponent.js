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
            <text>{obj.name} - {projects[obj.projectId]} - {obj.due ? obj.due.toISOString() : 'no due date'} - {obj.labels && obj.labels.length > 0 ? obj.labels.map(label => labels[label]).reduce((acc, label) => acc + ', ' + label) : 'no labels'}</text>
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