import { useEffect, useRef, useState } from 'react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { Task } from '../classes';
import { TaskComponent } from '../components';
import { todoistFilterToString } from '../utilities/dates';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

function TodoistTaskListView({ token, projects, labels, filters }) {
    const [ api, setApi ] = useState(new TodoistApi(token));
    const [ tasks, setTasks ] = useState([]);
    const [ isAdding, setIsAdding ] = useState(false);
    var newTaskName = useRef('');
    var newTaskProject = useRef('');
    var newTaskLabels = useRef([]);
    var newTaskDue = useRef(new Date());
    var newTaskAllDay = useRef(false);

    useEffect(() => {
        if (api) getTasks();
    }, []);

    async function generateFilter() {
        var res = [];
        if (filters.dates) {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0);
            tomorrow.setMinutes(0);
            tomorrow.setSeconds(0);
            if (filters.dates.start >= tomorrow) {
                res.push(`(due after: ${todoistFilterToString(filters.dates.start)} | due before: ${todoistFilterToString(filters.dates.end)})`);
            } else {
                res.push(`due before: ${todoistFilterToString(filters.dates.end)}`);
            }
        }
        if (filters.project_id) {
            const project_name = await api.getProject(filters.project_id).then(project => project.name).catch(error => console.log(`Project: ${error.message}`));
            res.push(`#${project_name}`);
        }
        if (filters.label_id) {
            const label_name = await api.getLabel(filters.label_id).then(label => label.name).catch(error => console.log(`Label: ${error.message}`));
            res.push(`${label_name}`);
        }
        res = res.reduce((acc, f) => acc + f);
        return res;
    }

    async function getTasks() {
        const filter_str = await generateFilter();
        api.getTasks({filter: filter_str})
        .then(res => res.map(task => {
            return new Task(true, task.id, task.content, task.projectId, task.labels, task.isCompleted, task.duration.unit.localeCompare('day') == 0 ? 1440 : task.duration.amount, null, task.due);
        }))
        .then(res => res.sort((t1, t2) => {
            if (t1.projectId.localeCompare(t2.projectId) != 0)
                return t1.projectId.localeCompare(t2.projectId);
            if (t1.due !== t2.due)
                return t1.due - t2.due;
            return 0;
        }))
        .then(res => setTasks(res))
        .catch(error => console.log(error));
    }

    async function createTask() {
        await api.addTask({content: newTaskName, projectId: newTaskProject, labels: newTaskLabels, dueDatetime: newTaskDue.toISOString()})
        .catch(error => console.log(error));
        await getTasks();
    }

    async function editTask(id, newName) {
        await api.updateTask(id, {content: newName})
        .catch(error => console.log(error));
        await getTasks();
    }

    async function completeTask(id) {
        await api.closeTask(id)
        .catch(error => console.log(error));
        await getTasks();
    }

    async function deleteTask(id) {
        await api.deleteTask(id)
        .catch(error => console.log(error));
        await getTasks();
    }

    if(!api) return <span>Loading...</span>;

    return (
        <>
            <button onClick={() => setIsAdding(true)}>Aggiungi attività</button>
            {
                isAdding && (
                    <>
                        <input type='text' autoComplete='off' onChange={(e) => newTaskName.current = e.target.value} />
                        {
                            newTaskAllDay.current ? (
                                <>
                                    <p />
                                    <DatePicker minDate={new Date()} value={newTaskDue.current} onChange={(v) => newTaskDue.current = v} />
                                </>
                            ) : (
                                <>
                                    <p />
                                    <DateTimePicker minDate={new Date()} value={newTaskDue.current} onChange={(v) => newTaskDue.current = v} />
                                </>
                            )
                        }
                        <select onChange={e => newTaskProject.current = e.target.value}>
                        {
                            projects.map(p => <option value={p.id}>{p.name}</option>)
                        }
                        </select>
                        <select multiple={true} onChange={e => newTaskLabels.current = Array.from(e.target.selectedOptions, option => option.value)}>
                        {
                            labels.map(p => <option value={p.name}>{p.name}</option>)
                        }
                        </select>
                        <button onClick={createTask}>Invia</button>
                    </>
                )
            }
            <ul>
            {
                tasks.map((task) => <li key={task.id}><TaskComponent obj={task} editFunc={editTask} closeFunc={completeTask} deleteFunc={deleteTask} /></li>)
            }
            </ul>
        </>
    );
}

export default TodoistTaskListView;