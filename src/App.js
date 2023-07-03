import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, Calendar } from './components';

function App() {

    const session = useSession();
    const supabase = useSupabaseClient();
    const [ section, setSection ] = useState('calendar');

    async function googleSignIn() {
        // console.log(window.location.origin)
        const { error } =  await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            },
        });
        if (error) {
            alert('Error signing in with google');
            console.log(error.message);
        } else {
            // fetchCalendars();
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return (
        <div className="app">
            <div className="sections">
                <button onClick={() => setSection('calendar')}>Calendar</button>
                <p />
                <button onClick={() => setSection('tasks')}>Attività</button>
                <p />
                <button onClick={() => setSection('chat')}>Chat</button>
            </div>
            <div style={{width: '400px', margin: "30px auto"}}>
                {
                    session &&
                    <>
                        {
                            section.localeCompare('calendar') == 0 ?
                            <Calendar />
                            :
                            section.localeCompare('tasks') == 0 ?
                            <></>
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
