import { useEffect, useState } from 'react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import PropTypes from 'prop-types';
import { Task } from '../classes';
import { closeTask } from '../utilities/todoist';

function TaskComponent({ token, obj }) {
    const [checked, setChecked] = useState(false);

    console.log(obj);

    async function handleCheck() {
        setChecked(!checked);
        console('check');
        await closeTask(token, obj.id);
    }

    return (
        // handle edit name
        <>
            <input type="checkbox" onChange={handleCheck} />
            <text>{obj.name} - {obj.project_id} - {obj.due.toISOString()} - {obj.labels.reduce((acc, label) => acc + ',' + label, [])}</text>
        </>
    )
}

TaskComponent.propTypes = {
    token: PropTypes.string.isRequired,
    obj: PropTypes.instanceOf(Task).isRequired
}

export default TaskComponent;