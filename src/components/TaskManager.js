import { useEffect, useState, useRef } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { LabelsView, ProjectsView, TaskListView, TodoistTaskListView, TodoistProjectsView, TodoistLabelsView } from '../components';
import { TMApiContext, TMProjectsContext, TMLabelsContext, TMFilterContext } from '../contexts/TMContext';

function TaskManager() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const { api, setApi } = useContext(TMApiContext);
    const { projects, setProjects } = useContext(TMProjectsContext);
    const { labels, setLabels } = useContext(TMLabelsContext);
    const [ isLoading, setIsLoading ] = useState(true);
    let token = useRef('');
    // const [ api, setApi ] = useState(null);
    // const [ projects, setProjects ] = useState({});
    // const [ labels, setLabels ] = useState({});
    // const [ filter, setFilter ] = useState({dates: {start: new Date(2023, 6, 6), end: new Date(2023, 6, 8)}});

    async function getApi() {
        console.log('started getApi');
        let tapi = null;
        let { data, error } = await supabase
        .from('todoist_tokens')
        .select('token')
        .eq('id', session.user.id);
        if (data.length > 0) {
            tapi = new TodoistApi(data[0].token);
            setApi(tapi);
            console.log('retrieved token');
        }
        if (error) {
            alert('Errore nella ricerca del token: ' + error.message);
            console.log(error);
        }
        console.log('finished getApi');
        if (tapi) return tapi;
    }

    async function insertToken() {
        const tapi = new TodoistApi(token.current);
        var valid = true;
        tapi.getProjects()
        .catch((error) => {
            alert(`Token non valido: ${error.message}`);
            console.log(error);
            valid = false;
        })
        if (!valid)
            return;
        setApi(tapi);
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

    /* function generateFilter() {                             // put this in TodoistTaskListView
        var res = [];
        if (tmcontext.filter.dates) {
            const start = `${tmcontext.filter.dates.start.getMonth()}/${tmcontext.filter.dates.start.getDate()}/${tmcontext.filter.dates.start.getFullYear()}`;
            const end = `${tmcontext.filter.dates.end.getMonth()}/${tmcontext.filter.dates.end.getDate()}/${tmcontext.filter.dates.end.getFullYear()}`;
            res.push(`(due after: ${start} | due before: ${end})`);
        }
        if (tmcontext.filter.project) {
            res.push(`#${projects[tmcontext.filter.project] ?? 'Inbox'}`);
        }
        if (tmcontext.filter.label) {
            res.push(`#${tmcontext.filter.label}`);
        }
        return res.reduce((acc, f) => acc + ' & ' + f);
    } */

    async function getProjects(tapi = null) {
        console.log('started getProjects');
        var res = null;
        if (tapi) {
            console.log('getProjects todoist');
            res = await tapi.getProjects().then(values => values.reduce((acc, p) => {
                acc[p.id] = p.name;
                return acc;
            }, {}))
            .catch(error => console.log(error));
        } else {
            console.log('getProjects supabase');
            let { data, error } = await supabase
            .from('projects')
            .select('id,name')
            .eq('owner', session.user.id);
            console.log('getProjects retrieval done');
            if (data) {
                console.log('getProjects reduce start');
                res = data.reduce((acc, p) => {
                    acc[p.id] = p.name;
                    return acc;
                }, {});
                console.log('getProjects reduce done');
            }
            if (error) {
                alert(error.message);
                console.log(error);
            }
        }
        setProjects(res);
        // return res;
        console.log('finished getProjects');
    }

    async function getLabels(tapi = null) {
        console.log('started getLabels');
        var res = null;
        if (tapi) {
            console.log('getLabels todoist');
            res = await tapi.getLabels().then(values => values.reduce((acc, l) => {
                acc[l.id] = l.name;
                return acc;
            }, {}))
            .catch(error => console.log(error));
        } else {
            console.log('getLabels supabase');
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
        setLabels(res);
        // return res;
        console.log('finished getLabels');
    }

    /* function changeFilter(newFilter) {
        console.log(newFilter);
        console.log('changing filter');
        setFilter(newFilter);
        console.log('changed filter');
    } */

    useEffect(async () => {
        try {
            console.log(typeof setApi, typeof setProjects, typeof setLabels);
            await getApi();
            await getProjects();
            await getLabels();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }, []);



    return (
        <div>
        {
            isLoading ? (
                <span>Loading...</span>
            )
            :
            (tmcontext.api) ? (
                <>
                    <input type="text" autocomplete="off" onChange={e => token.current = e.target.value} />
                    <button onClick={() => insertToken()}>Set todoist token</button>
                    <hr />
                    <ProjectsView />
                    <hr />
                    <LabelsView />
                    <hr />
                    <TaskListView />
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