import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { TodoistTaskListView } from '../components';

function TaskManager({ filters }) {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ token, setToken ] = useState('');
    const [ tmpToken, setTmpToken ] = useState('');
    const [ filterString, setFilterString ] = useState(generateFilter());
    let api = null;

    async function getToken() {
        let { data, error } = await supabase
        .from('todoist_tokens')
        .select('token')
        .eq('id', session.user.id);
        console.log(data);
        console.log(error);
        if (data.length > 0) {
            setToken(data[0].token);
            api = new TodoistApi(token);
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
        const { error } = await supabase
        .from('todoist_tokens')
        .insert([
            { id: session.user.id, token: token }
        ]);
        if (error) {
            alert('Error inserting token: ' + error.message);
            console.log(error);
        }
    }

    async function generateFilter() {
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

    useEffect(() => {
        getToken();
    }, []);

    return (
        <>
        {
            token.length == 0 ? (
                <>
                    <input type="text" autocomplete="off" onChange={e => setTmpToken(e.target.value)} />
                    <button onClick={() => insertToken()}>Set todoist token</button>
                    {/* ProjectsView (change filter) */}
                    {/* LabelsView (change filter) */}
                    {/* TaskListView */}
                </>
            ) : (
                <>
                    {/* TodoistProjectsView (change filter) */}
                    {/* TodoistLabelsView (change filter) */}
                    <TodoistTaskListView api={api} filters={filters} />
                </>
            )
        }
        </>
    );
}

TaskManager.propTypes = {
    filters: PropTypes.shape({
        dates: PropTypes.shape({
            start: PropTypes.object.isRequired,
            end: PropTypes.object.isRequired
        }),
        project_id: PropTypes.string,
        label_id: PropTypes.string
    })
}

export default TaskManager;