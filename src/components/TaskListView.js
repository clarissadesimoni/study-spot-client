import { useEffect, useRef, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { Task } from '../classes';
import { TaskComponent } from '../components';
import { supabaseFilterToString } from '../utilities/dates';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

function TaskListView({ projects, labels, filters }) {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ tasks, setTasks ] = useState([]);
    const [ isAdding, setIsAdding ] = useState(false);
    var newTaskName = useRef('');
    var newTaskProject = useRef('');
    var newTaskLabels = useRef([]);
    var newTaskDue = useRef(new Date());
    var newTaskAllDay = useRef(false);

    useEffect(async () => {
        if (projects.length == 0) newTaskProject.current = projects[0].id;
        await getTasks();
    }, []);

    async function getTasks() {
        let query = supabase
        .from('tasks')
        .select()
        .eq('isCompleted', false);
        if (filters.dates)
            query = query.gte('due', supabaseFilterToString(filters.dates.start)).lte('due', supabaseFilterToString(filters.dates.end));
        if (filters.project)
            query = query.eq('projectId', filters.project);
        if (filters.label)
            query = query.contains('labels', [filters.label]);
        let { data, error } = await query;
        if (data) {
            data = data.map(task => {
                return new Task(false, task.id, task.title, task.projectId, task.labels, task.isCompleted, task.durationMinutes, new Date(+task.due), null);
            }).sort((t1, t2) => {
                if (t1.projectId.localeCompare(t2.projectId) != 0)
                    return t1.projectId.localeCompare(t2.projectId);
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
        console.log({ title: newTaskName.current, projectId: newTaskProject.current, labels: newTaskLabels.current, due: (newTaskDue.current.toISOString()).toLocaleString('it-IT'), isCompleted: false, owner: session.user.id });
        const { error } = await supabase
        .from('tasks')
        .insert([
        { title: newTaskName.current, projectId: newTaskProject.current, labels: newTaskLabels.current, due: (newTaskDue.current.toISOString()).toLocaleString('it-IT'), isCompleted: false, owner: session.user.id },
        ]);
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
                        <select onClick={e => newTaskProject.current = e.target.value}>
                        {
                            projects.map(p => <option value={p.id} onClick={() => newTaskProject.current = p.id}>{p.name}</option>)
                        }
                        </select>
                        <select multiple={true} onChange={e => newTaskLabels.current = Array.from(e.target.selectedOptions, option => option.value)}>
                        {
                            labels.map(l => <option value={l.id}>{l.name}</option>)
                        }
                        </select>
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