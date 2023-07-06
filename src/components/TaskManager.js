import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { LabelsView, ProjectsView, TaskListView, TodoistTaskListView, TodoistProjectsView, TodoistLabelsView } from '../components';

function TaskManager() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ token, setToken ] = useState('');
    const [ tmpToken, setTmpToken ] = useState('');
    const [ api, setApi ] = useState(null);
    const [ projects, setProjects ] = useState({});
    const [ labels, setLabels ] = useState({});
    const [ filter, setFilter ] = useState({});
    const [ query, setQuery ] = useState(null);
    const [ tlist, setTlist ] = useState(<></>);

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

    function generateFilter(filters) {
        var res = [];
        if (filters.dates) {
            const start = `${filters.dates.start.getMonth()}/${filters.dates.start.getDate()}/${filters.dates.start.getFullYear()}`;
            const end = `${filters.dates.end.getMonth()}/${filters.dates.end.getDate()}/${filters.dates.end.getFullYear()}`;
            res.push(`(due after: ${start} | due before: ${end})`);
        }
        if (filters.project) {
            // const project_name = await api.getProject(filters.project_id).then(project => project.name);
            res.push(`#${projects[filters.project] ?? 'Inbox'}`);
        }
        if (filters.label) {
            // const label_name = await api.getLabel(filters.label_id).then(label => label.name);
            res.push(`#${filters.label}`);
        }
        return res.reduce((acc, f) => acc + f);
    }

    /* function generateQuery(filters) {
        let query = supabase
        .from('tasks')
        .select()
        .eq('isCompleted', false);
        if (filters.dates) {
            query = query.gte('due', supabaseFilterToString(filters.dates.start)).lte('due', supabaseFilterToString(filters.dates.end));
        }
        if (filters.project) {
            query = query.eq('projectId', filters.project);
        }
        if (filters.label) {
            query = query.contains('labels', [filters.label]);
        }
        return query;
    } */

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
                res = data;
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        return res;
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
                res = data;
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        return res;
    }

    function changeFilter(newFilter) {
        console.log(newFilter);
        console.log('changing query');
        setFilter(newFilter);
        setQuery('re-render');
        console.log('changed query');
        console.log(typeof newFilter);
        if (token.length == 0 || api == null || api == undefined)
            setTlist(<TaskListView projects={projects} labels={labels} filters={newFilter} />);
        else
            setTlist(<TodoistTaskListView token={token} projects={projects} labels={labels} filters={generateFilter(newFilter)} />);
    }

    useEffect(async () => {
        await getToken();
        const prg = await getProjects();
        setProjects(prg);
        const lbl = await getLabels();
        setLabels(lbl);
        /* if (token.length == 0 || api == null || api == undefined)
            setTlist(<TaskListView projects={projects} labels={labels} filters={filter} />);
        else
            setTlist(<TodoistTaskListView token={token} projects={projects} labels={labels} filters={generateFilter(filter)} />); */
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
                    {/* <ProjectsView projects={projects} filterFunc={changeFilter} />
                    <hr />
                    <LabelsView labels={labels} filterFunc={changeFilter} />
                    <hr /> */}
                    <TaskListView projects={projects} labels={labels} filters={filter} />
                </>
            ) : (
                <>
                    <TodoistProjectsView projects={projects} filterFunc={changeFilter} />
                    <hr />
                    <TodoistLabelsView labels={labels} filterFunc={changeFilter} />
                    <hr />
                    {tlist}
                </>
            )
        }
        </>
    );
}

export default TaskManager;