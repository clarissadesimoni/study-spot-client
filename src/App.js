import axios from 'axios';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';

function App() {

    const session = useSession(); // tokens
    const supabase = useSupabaseClient();
    const isLoading = useSessionContext();
    const [ start, setStart ] = useState(new Date());
    const [ end, setEnd ] = useState(new Date());
    const [ eventName, setEventName ] = useState('');

    async function googleSignIn() {
        const { error } =  await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
                redirectTo: window.location.origin
            },
        });
        if (error) {
            alert('Error signing in with google');
            console.log(error);
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    async function createCalendarEvent() {
        const event = {
            summary: eventName,
            start: {
                dateTime: start.toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: end.toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }
        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: "POST",
            headers: {
                'Authorization':'Bearer ' + session.provider_token // Access token for google
            },
            body: JSON.stringify(event)
        }).then((data) => data.json)
        .then((data) => {
            console.log(data);
            alert("Event created, check your Google Calendar!");
        });
    }

    return (
        <div className="app">
            <div style={{width: '400px', margin: "30px auto"}}>
                {
                    session ?
                    <>
                        <h2>Hey user {session.user.email}</h2>
                        <div>
                            <p>Start of event:</p>
                            <DateTimePicker onChange={setStart} value={start} />
                            <p>End of event:</p>
                            <DateTimePicker onChange={setEnd} value={end} />
                            <p>Name of event:</p>
                            <input type="text" onChange={(e) => setEventName(e.target.value)} />
                        </div>
                        <button onClick={() => createCalendarEvent()}>Create calendar event</button>
                        <hr />
                        <button onClick={() => signOut()}>Sign out</button>
                    </>
                    :
                    <>
                        <button onClick={() => googleSignIn()}>Sign in with Google</button>
                    </>
                }
            </div>
        </div>
    );
}

export default App;
