import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Task } from '../classes';
import { TaskComponent } from '../components';
import { supabaseFilterToString } from '../utilities/dates';
import { TMProjectsContext, TMLabelsContext, TMFilterContext } from '../contexts/TMContext';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

function TaskListView() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const { filter, setFilter } = React.useContext(TMFilterContext);
    const [ tasks, setTasks ] = useState([]);
    const [ isAdding, setIsAdding ] = useState(false);
    var newTaskName = useRef('');
    var newTaskProject = useRef('');
    var newTaskLabels = useRef([]);
    var newTaskDue = useRef(new Date());
    var newTaskAllDay = useRef(false);

    useEffect(() => {
        getTasks();
    }, []);

    useEffect(() => {
        getTasks();
    }, [filter]);
    
    async function getTasks() {
        let query = supabase
        .from('tasks')
        .select()
        .eq('isCompleted', false);
        let { data, error } = await query;
        if (data) {
            if (filter.dates) {
                data = data.filter(task => {
                    let due = new Date(Date.parse(task.due + 'Z'));
                    return filter.dates.start <= due <= filter.dates.end;
                })
            }
            if (filter.projectId) {
                data = data.filter(task => task.projectId == filter.projectId);
            }
            if (filter.labelId) {
                data = data.filter(task => task.labels.includes(+filter.labelId));
            }
            data = data.map(task => {
                const tmp = new Task(false, task.id, task.title, task.projectId, task.labels, task.isCompleted, task.durationMinutes, new Date(Date.parse(task.due + 'Z')), null);
                return tmp;
            }).sort((t1, t2) => {
                if (t1.projectId - t2.projectId != 0)
                    return t1.projectId - t2.projectId;
                if (t1.due !== t2.due)
                    return t1.due - t2.due;
                return 0;
            });
            setTasks(data);
        }
        if (error) {
            alert(error.message);
            console.log(error);
        }
    }

    async function createTask() {
        const tmp = { title: newTaskName.current, projectId: Object.keys(projects).length == 1 ? Object.keys(projects)[0].id : newTaskProject.current, labels: newTaskLabels.current, due: (newTaskDue.current.toISOString()).toLocaleString('it-IT'), isCompleted: false, owner: session.user.id };
        console.log(tmp);
        const { error } = await supabase
        .from('tasks')
        .insert([tmp]);
        if (error) {
            alert(error.message);
            console.log(error);
        }
        await getTasks();
    }

    async function editTask(id, newName) {
        const { error } = await supabase
        .from('tasks')
        .update({ title: newName })
        .eq('id', id);
        if (error) {
            alert(error.message);
            console.log(error);
        }
        await getTasks();
    }
    
    async function completeTask(id) {
        const { error } = await supabase
        .from('tasks')
        .update({isCompleted: true})
        .eq('id', id);
        if (error) {
            alert(error.message);
            console.log(error);
        }
        await getTasks();
    }

    async function deleteTask(id) {
        const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        if (error) {
            alert(error.message);
            console.log(error);
        }
        await getTasks();
    }

    const projectsOptions = Object.keys(projects).map(k => {
        return {
            value: k,
            label: projects[k]
        }
    })

    const labelsOptions = Object.keys(labels).map(k => {
        return {
            value: k,
            label: labels[k]
        }
    })

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
                                    <DatePicker minDate={new Date()} value={newTaskDue.current} onChange={(v) => newTaskDue.current = v} />
                                </>
                            ) : (
                                <>
                                    <p />
                                    <DateTimePicker minDate={new Date()} value={newTaskDue.current} onChange={(v) => newTaskDue.current = v} />
                                </>
                            )
                        }
                        {
                            projects ? (
                                // <select onClick={e => newTaskProject.current = e.value}>
                                // {
                                //     Object.keys(projects).map(p => <option value={p} onClick={(e) => newTaskProject.current = e.value}>{projects[p]}</option>)
                                // }
                                // </select>
                                <Select options={Object.keys(projects).map(k => {
                                    return {
                                        value: k,
                                        label: projects[k]
                                    }
                                })} onChange={selected => newTaskLabels.current = selected} />
                            ) : (
                                <p>new task project selection</p>
                            )
                        }
                        {
                            labels ? (
                                // <select multiple={true} onChange={e => newTaskLabels.current = Array.from(e.target.selectedOptions, option => option.value)}>
                                // {
                                //     Object.keys(labels).map(l => <option value={l}>{labels[l]}</option>)
                                // }
                                // </select>
                                <Select isMulti={true} options={Object.keys(labels).map(k => {
                                    return {
                                        value: k,
                                        label: labels[k]
                                    }
                                })} onChange={selected => newTaskLabels.current = selected} />
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

export default TaskListView;