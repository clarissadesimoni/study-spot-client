import React, { useRef, useState } from 'react';
import { TMProjectsContext, TMLabelsContext } from '../contexts/TMContext';

function TaskComponent({ obj, editFunc, closeFunc, deleteFunc }) {
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const [isEditing, setIsEditing] = useState(false);
    var newName = useRef('');

    var dtf = new Intl.DateTimeFormat('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    var df = new Intl.DateTimeFormat('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Rome' });

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
            <text>{obj.name} - {projects[obj.projectId]} - {obj.due ? (obj.isAllDay ? df.format(obj.due) : dtf.format(obj.due)) : 'no due date'} - {obj.labels && obj.labels.length > 0 ? obj.labels.map(label => labels[label]).reduce((acc, label) => acc + ', ' + label) : 'no labels'}</text>
            <button className='btn tm-btn' onClick={() => setIsEditing(true)}>Rinomina</button>
            {
                isEditing && (
                    <>
                        <input className='tm-input' type='text' autoComplete='off' onChange={e => newName.current = e.target.value} />
                        <button className='btn tm-btn' onClick={handleEdit}>Invia</button>
                    </>
                )
            }
            <button className='btn tm-btn' onClick={handleDelete}>Rimuovi</button>
        </>
    )
}

export default TaskComponent;