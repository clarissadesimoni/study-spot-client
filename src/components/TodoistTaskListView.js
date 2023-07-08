import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { Task } from '../classes';
import { TaskComponent } from '../components';
import { TMApiContext, TMProjectsContext, TMLabelsContext, TMFilterContext } from '../contexts/TMContext';
import { todoistFilterToString } from '../utilities/dates';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function TodoistTaskListView() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ tasks, setTasks ] = useState([]);
    const [ isAdding, setIsAdding ] = useState(false);
    const [ newTaskDue, setNewTaskDue ] = useState(new Date());
    const { api, setApi } = React.useContext(TMApiContext);
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);
    var newTaskName = useRef('');
    var newTaskProject = useRef('');
    var newTaskLabels = useRef([]);
    var newTaskAllDay = useRef(false);

    useEffect(() => {
        if (api) getTasks();
    }, []);

    useEffect(() => {
        getTasks();
    }, [filter]);

    function generateFilter() {
        var res = [];
        if (filter.dates) {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0);
            tomorrow.setMinutes(0);
            tomorrow.setSeconds(0);
            if (filter.dates.start >= tomorrow) {
                res.push(`(due after: ${todoistFilterToString(filter.dates.start)} | due before: ${todoistFilterToString(filter.dates.end)})`);
            } else {
                res.push(`due before: ${todoistFilterToString(filter.dates.end)}`);
            }
        }
        if (filter.projectId) {
            res.push(`#${projects[filter.projectId]}`);
        }
        if (filter.labelId) {
            res.push(`${labels[filter.labelId]}`);
        }
        res = res.length == 0 ? '' : res.reduce((acc, f) => acc + f);
        return res;
    }

    async function getTasks() {
        const filter_str = generateFilter();
        api.getTasks({filter: filter_str})
        .then(res => res.map(task => {
            return new Task(true, task.id, task.content, task.projectId, task.labels, task.isCompleted, task.duration ? task.duration.unit.localeCompare('day') == 0 ? 1440 : task.duration.amount : null, null, task.due);
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
        setIsAdding(false);
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
            {
                isAdding ? (
                    <>
                        <input type='text' autoComplete='off' onChange={(e) => newTaskName.current = e.target.value} />
                        {
                            newTaskAllDay.current ? (
                                <>
                                    <p />
                                    <DatePicker minDate={new Date()} value={newTaskDue} onChange={(v) => setNewTaskDue(v)} />
                                </>
                            ) : (
                                <>
                                    <p />
                                    <DateTimePicker minDate={new Date()} value={newTaskDue} onChange={(v) => setNewTaskDue(v)} />
                                </>
                            )
                        }
                        {
                            projects ? (
                                <Select options={Object.keys(projects).map(k => {
                                    return {
                                        value: k,
                                        label: projects[k]
                                    }
                                })} onChange={selected => newTaskProject.current = selected.value} />
                            ) : (
                                <p>new task project selection</p>
                            )
                        }
                        {
                            labels ? (
                                <Select isMulti={true} options={Object.keys(labels).map(k => {
                                    return {
                                        value: k,
                                        label: labels[k]
                                    }
                                })} onChange={selected => newTaskLabels.current = selected.map(selected => selected.value)} />
                            ) : (
                                <p>new task labels selection</p>
                            )
                        }
                        <button onClick={createTask}>Invia</button>
                    </>
                ) : <button onClick={() => setIsAdding(true)}>Aggiungi attività</button>
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