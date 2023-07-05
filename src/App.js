import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, Calendar, TaskManager } from './components';

function App() {

    const session = useSession();
    const supabase = useSupabaseClient();
    const [ section, setSection ] = useState('tasks');

    return (
        <div className="app">
            <div className="sections">
                <button onClick={() => setSection('calendar')}>Calendar</button>
                <p />
                <button onClick={() => setSection('tasks')}>Attività</button>
                <p />
                <button onClick={() => setSection('chat')}>Chat</button>
            </div>
            <div style={{width: '800px', margin: "30px auto"}}>
                {
                    session &&
                    <>
                        {
                            section.localeCompare('calendar') == 0 ?
                            <Calendar />
                            :
                            section.localeCompare('tasks') == 0 ?
                            <TaskManager />
                            :
                            section.localeCompare('chat') == 0 ?
                            <></>
                            :
                            <></>
                        }
                        <hr />
                    </>
                }
                <Auth />
            </div>
        </div>
    );
}

export default App;
