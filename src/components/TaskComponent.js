import { useEffect, useState } from 'react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import PropTypes from 'prop-types';
import { Task } from '../classes';

function TaskComponent({ obj, closeFunc }) {
    const [checked, setChecked] = useState(false);

    console.log(obj);

    async function handleCheck() {
        setChecked(!checked);
        closeFunc(obj);
    }

    return (
        // handle edit name
        <>
            <input type="checkbox" onchange={handleCheck} />
            <text>{obj.name} - {obj.project_id} - {obj.due.toISOString()} - {obj.labels.reduce((acc, label) => acc + ',' + label, [])}</text>
        </>
    )
}

TaskComponent.propTypes = {
    obj: PropTypes.instanceOf(Task).isRequired,
    closeFunc: PropTypes.func.isRequired
}

export default TaskComponent;