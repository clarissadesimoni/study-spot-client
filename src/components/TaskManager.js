import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { TaskListView, TodoistTaskListView, TodoistProjectsView, TodoistLabelsView, ProjectsView, LabelsView } from '../components';

function TaskManager() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ token, setToken ] = useState('');
    const [ tmpToken, setTmpToken ] = useState('');
    const [ api, setApi ] = useState(null);
    const [ projects, setProjects ] = useState({});
    const [ labels, setLabels ] = useState({});
    const [ filter, setFilter ] = useState({dates: {start: yesterday, end: tomorrow}});
    
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    async function getToken() {
        let { data, error } = await supabase
        .from('todoist_tokens')
        .select('token')
        .eq('id', session.user.id);
        if (data.length > 0) {
            setToken(data[0].token);
            setApi(new TodoistApi(data[0].token));
        }
        if (error) {
            alert('Error retrieving token: ' + error.message);
            console.log(error);
        }
    }

    async function insertToken() {
        api = new TodoistApi(tmpToken);
        var valid = true;
        api.getProjects()
        .catch((error) => {
            alert(`Invalid token: ${error.message}`);
            console.log(error);
            valid = false;
        })
        if (!valid)
            return;
        setToken(tmpToken);
        const { data, error } = await supabase
        .from('todoist_tokens')
        .insert([
            { id: session.user.id, token: tmpToken }
        ])
        .select();
        if (error) {
            alert('Error inserting token: ' + error.message);
            console.log(error);
        }
    }

    async function generateFilter(filters) {
        var res = [];
        if (filters.dates) {
            const start = `${filters.dates.start.getMonth()}/${filters.dates.start.getDate()}/${filters.dates.start.getFullYear()}`;
            const end = `${filters.dates.end.getMonth()}/${filters.dates.end.getDate()}/${filters.dates.end.getFullYear()}`;
            res.push(`(due after: ${start} | due before: ${end})`);
        }
        if (filters.project_id) {
            const project_name = await api.getProject(filters.project_id).then(project => project.name);
            res.push(`#${project_name}`);
        }
        if (filters.label_id) {
            const label_name = await api.getLabel(filters.label_id).then(label => label.name);
            res.push(`#${label_name}`);
        }
        return res.reduce((acc, f) => acc + f);
    }

    async function getProjects() {
        var res = null;
        if (api) {
            res = await api.getProjects().then(values => values.reduce((acc, p) => {
                acc[p.id] = p.name;
                return acc;
            }, {}))
            .catch(error => console.log(error));
        } else {
            let { data, error } = await supabase
            .from('projects')
            .select('id,name')
            .eq('owner', session.user.id);
            if (data) {
                console.log(data);
                res = data;
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        setProjects(res);
    }

    async function getLabels() {
        var res = null;
        if (api) {
            res = await api.getLabels().then(values => values.reduce((acc, l) => {
                acc[l.id] = l.name;
                return acc;
            }, {}))
            .catch(error => console.log(error));
        } else {
            let { data, error } = await supabase
            .from('labels')
            .select('id,name')
            .eq('owner', session.user.id);
            if (data) {
                console.log(data);
                res = data;
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        setLabels(res);
    }

    useEffect(async () => {
        await getToken();
        await getProjects();
        await getLabels();
        console.log(projects);
        console.log(labels);
        setIsLoading(false);
    }, []);

    return (
        <>
        {
            isLoading ? (
                <span>Loading...</span>
            )
            :
            (token.length == 0 || api == null || api == undefined) ? (
                <>
                    <input type="text" autocomplete="off" onChange={e => setTmpToken(e.target.value)} />
                    <button onClick={() => insertToken()}>Set todoist token</button>
                    <hr />
                    <ProjectsView projects={projects} filterFunc={setFilter} />
                    <LabelsView labels={labels} filterFunc={setFilter} />
                    <hr />
                    <TaskListView projects={projects} labels={labels} filters={filter} />
                </>
            ) : (
                <>
                    <TodoistProjectsView projects={projects} filterFunc={setFilter} />
                    <TodoistLabelsView labels={labels} filterFunc={setFilter} />
                    <hr />
                    <TodoistTaskListView token={token} projects={projects} labels={labels} filters={generateFilter(filter)} />
                </>
            )
        }
        </>
    );
}

export default TaskManager;