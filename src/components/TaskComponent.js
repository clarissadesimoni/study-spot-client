import { useEffect, useState } from 'react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import PropTypes from 'prop-types';
import { Task } from '../classes';
import { closeTask } from '../utilities/todoist';

function TaskComponent({ token, obj, closeFunc }) {
    const [checked, setChecked] = useState(false);

    async function handleCheck() {
        setChecked(!checked);
        console.log('check');
        closeFunc(obj);
        // if (checked) await closeTask(token, obj.id);
    }

    return (
        // handle edit name
        <>
            <input type="checkbox" onChange={handleCheck} />
            <text>{obj.name} - {obj.projectId} - {obj.due.toISOString()} - {obj.labels.reduce((acc, label) => acc + ',' + label, [])}</text>
        </>
    )
}

TaskComponent.propTypes = {
    token: PropTypes.string.isRequired,
    obj: PropTypes.instanceOf(Task).isRequired,
    closeFunc: PropTypes.func
}

export default TaskComponent;