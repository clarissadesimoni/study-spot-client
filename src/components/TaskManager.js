import React, { useEffect, useState, useRef } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { LabelsView, ProjectsView, TaskListView, TodoistTaskListView, TodoistProjectsView, TodoistLabelsView } from '../components';
import { TMApiContext, TMProjectsContext, TMLabelsContext } from '../contexts/TMContext';

function TaskManager() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const { api, setApi } = React.useContext(TMApiContext);
    const { projects, setProjects } = React.useContext(TMProjectsContext);
    const { labels, setLabels } = React.useContext(TMLabelsContext);
    const [ isLoading, setIsLoading ] = useState(true);
    let token = useRef('');
    let tapi = useRef(null);

    async function getApi() {
        let tapi = null;
        let { data, error } = await supabase
        .from('todoist_tokens')
        .select('token')
        .eq('id', session.user.id);
        if (data.length > 0) {
            tapi = new TodoistApi(data[0].token);
            setApi(tapi);
        }
        if (error) {
            alert('Errore nella ricerca del token: ' + error.message);
            console.log(error);
        }
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
        var res = null;
        if (tapi) {
            res = await tapi.getProjects().then(values => values.reduce((acc, p) => {
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
        setProjects(res);
    }

    async function getLabels(tapi = null) {
        var res = null;
        if (tapi) {
            res = await tapi.getLabels().then(values => values.reduce((acc, l) => {
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
        setLabels(res);
    }

    useEffect(() => {
        try {
            getApi()
            .then((res) => {
                tapi.current = res;
            })
            .then(() => getProjects(tapi.current))
            .then(() => getLabels(tapi.current))
            .then(() => setIsLoading(false))
            .catch((err) => console.log(err));
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
            (tapi.current) ? (
                <>
                    <TodoistProjectsView />
                    <hr />
                    <TodoistLabelsView />
                    <hr />
                    <TodoistTaskListView />
                </>
            ) : (
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
            )
        }
        </div>
    );
}

export default TaskManager;