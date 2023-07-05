import { useEffect, useState } from 'react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import PropTypes from 'prop-types';
import { Task } from '../classes';
import { TaskComponent } from '../components';

function TodoistTaskListView({ token, filters }) {
    console.log(token);

    const [ api, setApi ] = useState(new TodoistApi(token));
    const [ tasks, setTasks ] = useState([]);

    useEffect(async () => {
        console.log('hello tasks 1');
        console.log(token);
        if (api) await getTasks();
        console.log('hello tasks 2');
    }, [api]);

    async function generateFilter() {
        var res = [];
        if (filters.dates) {
            const start = `${filters.dates.start.getMonth() + 1}/${filters.dates.start.getDate()}/${filters.dates.start.getFullYear()}`;
            const end = `${filters.dates.end.getMonth() + 1}/${filters.dates.end.getDate()}/${filters.dates.end.getFullYear()}`;
            res.push(`(due after: ${start} | due before: ${end})`);
        }
        if (filters.project_id) {
            const project_name = await api.getProject(filters.project_id).then(project => project.name).catch(error => console.log(`Project: ${error.message}`));
            res.push(`#${project_name}`);
        }
        if (filters.label_id) {
            const label_name = await api.getLabel(filters.label_id).then(label => label.name).catch(error => console.log(`Label: ${error.message}`));
            res.push(`#${label_name}`);
        }
        return res.reduce((acc, f) => acc + f);
    }

    async function getTasks() {
        console.log(api);
        const filter_str = await generateFilter();
        console.log(filter_str);
        api.getTasks({filter: filter_str})
        .then(res => res.map(task => {
            console.log(task);
            return new Task(true, task.id, task.content, task.projectId, task.labels, task.isCompleted, task.duration, null, task.due);
        }))
        .then(res => res.sort((t1, t2) => {
            console.log('sort');
            if (t1.projectId.localeCompare(t2.projectId) != 0)
                return t1.projectId.localeCompare(t2.projectId);
            if (t1.due !== t2.due)
                return t1.due - t2.due;
            return 0;
        }))
        .then(res => setTasks(res))
        .catch(error => console.log(error));
    }

    async function close(task_obj) {
        if (task_obj.isTodoist) {
            await api.closeTask(task_obj.id)
            .catch(error => console.log(error));
            await getTasks();
        }
    }

    if(!api) return <span>Loading...</span>;

    return (
        <ul>
        {
            tasks.map((task) => <li key={task.id}><TaskComponent api={api} obj={task} closeFunc={close} /></li>)
        }
        </ul>
    );
}

TodoistTaskListView.propTypes = {
    api: PropTypes.string.isRequired,
    filters: PropTypes.shape({
        dates: PropTypes.shape({
            start: PropTypes.object.isRequired,
            end: PropTypes.object.isRequired
        }),
        project_id: PropTypes.string,
        label_id: PropTypes.string
    })
}

export default TodoistTaskListView;