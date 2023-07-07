import { useEffect, useState, useContext } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { LabelsView, ProjectsView, TaskListView, TodoistTaskListView, TodoistProjectsView, TodoistLabelsView } from '../components';
import { TMContext } from '../contexts/TMContext';

function TaskManager() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const { context, setContext } = useContext(TMContext);
    const [ isLoading, setIsLoading ] = useState(true);
    let token = useRef('');
    // const [ api, setApi ] = useState(null);
    // const [ projects, setProjects ] = useState({});
    // const [ labels, setLabels ] = useState({});
    // const [ filter, setFilter ] = useState({dates: {start: new Date(2023, 6, 6), end: new Date(2023, 6, 8)}});

    async function getToken() {
        let { data, error } = await supabase
        .from('todoist_tokens')
        .select('token')
        .eq('id', session.user.id);
        if (data.length > 0) {
            setContext({ ...context, api: new TodoistApi(data[0].token) });
        }
        if (error) {
            alert('Errore nella ricerca del token: ' + error.message);
            console.log(error);
        }
    }

    async function insertToken() {
        api = new TodoistApi(token.current);
        var valid = true;
        api.getProjects()
        .catch((error) => {
            alert(`Token non valido: ${error.message}`);
            console.log(error);
            valid = false;
        })
        if (!valid)
            return;
        setContext({ ...context, api: new TodoistApi(data[0].token) })
        const { error } = await supabase
        .from('todoist_tokens')
        .insert([
            { id: session.user.id, token: token.current }
        ]);
        if (error) {
            alert('Errore nell\'inserimento del token: ' + error.message);
            console.log(error);
        }
    }

    function generateFilter() {                             // put this in TodoistTaskListView
        var res = [];
        if (context.filter.dates) {
            const start = `${context.filter.dates.start.getMonth()}/${context.filter.dates.start.getDate()}/${context.filter.dates.start.getFullYear()}`;
            const end = `${context.filter.dates.end.getMonth()}/${context.filter.dates.end.getDate()}/${context.filter.dates.end.getFullYear()}`;
            res.push(`(due after: ${start} | due before: ${end})`);
        }
        if (context.filter.project) {
            res.push(`#${projects[context.filter.project] ?? 'Inbox'}`);
        }
        if (context.filter.label) {
            res.push(`#${context.filter.label}`);
        }
        return res.reduce((acc, f) => acc + ' & ' + f);
    }

    async function getProjects() {
        var res = null;
        if (context.api) {
            res = await context.api.getProjects().then(values => values.reduce((acc, p) => {
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
                res = data.reduce((acc, p) => {
                    acc[p.id] = p.name;
                    return acc;
                }, {});
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        setContext({ ...context, projects: res });
        // return res;
    }

    async function getLabels() {
        var res = null;
        if (context.api) {
            res = await context.api.getLabels().then(values => values.reduce((acc, l) => {
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
                res = data.reduce((acc, l) => {
                    acc[l.id] = l.name;
                    return acc;
                }, {});
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        setContext({ ...context, labels: res });
        // return res;
    }

    /* function changeFilter(newFilter) {
        console.log(newFilter);
        console.log('changing filter');
        setFilter(newFilter);
        console.log('changed filter');
    } */

    useEffect(async () => {
        await getToken();
        /* let prg =  */await getProjects();
        // setProjects(prg);
        /* let lbl =  */await getLabels();
        // setLabels(lbl);
        setIsLoading(false);
    }, []);



    return (
        <div>
        {
            isLoading ? (
                <span>Loading...</span>
            )
            :
            (context.api) ? (
                <>
                    <input type="text" autocomplete="off" onChange={e => token.current = e.target.value} />
                    <button onClick={() => insertToken()}>Set todoist token</button>
                    <hr />
                    <ProjectsView />
                    <hr />
                    <LabelsView />
                    <hr />
                    <TaskListView projects={projects} labels={labels} filters={filter.current} rf={isLoading} />
                </>
            ) : (
                <>
                    <span>WIP</span>
                    {/* <TodoistProjectsView projects={projects} filterFunc={changeFilter} />
                    <hr />
                    <TodoistLabelsView labels={labels} filterFunc={changeFilter} />
                    <hr />
                    <TodoistTaskListView token={token} projects={projects} labels={labels} filters={generateFilter(filter.current)} /> */}
                </>
            )
        }
        </div>
    );
}

export default TaskManager;