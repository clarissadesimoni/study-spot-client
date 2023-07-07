import { useRef, useState } from 'react';
import { Task } from '../classes';

function TaskComponent({ obj, editFunc, closeFunc, deleteFunc }) {
    // const [checked, setChecked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    var newName = useRef('');

    async function handleEdit() {
        editFunc(obj.id, newName.current);
        setIsEditing(false);
    }

    async function handleCheck() {
        closeFunc(obj.id);
    }

    async function handleDelete() {
        deleteFunc(obj.id);
    }

    return (
        <>
            <input type="checkbox" onChange={handleCheck} />
            <text>{obj.name} - {obj.projectId} - {obj.due.toISOString()} - {obj.labels.reduce((acc, label) => acc + ',' + label)}</text>
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