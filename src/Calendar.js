import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { getStartOfWeek, getEndOfWeek } from './utilities/dates';
import './misc.css';

function App() {

    const session = useSession();
    const [ start, setStart ] = useState(new Date());
    const [ end, setEnd ] = useState(new Date());
    const [calendars, setCalendars ] = useState({});
    const [ eventName, setEventName ] = useState('');
    const [ eventList, setEventList ] = useState([]);

    function fetchCalendars() {
        fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            }
        })
        .then(response => response.json())
        .then(data => data.items.reduce((acc, cal) => {
            acc[cal.id] = cal.summary;
            return acc;
        }, {}))
        .then(dict => setCalendars(dict))
        .then(() => console.log('Fetched calendars'))
        .catch(error => {
            alert('Error fetching calendars');
            console.log(error.message);
        });
    }

    async function createCalendarEvent() {
        const events = {
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
                Authorization: 'Bearer ' + session.provider_token // Access token for google
            },
            body: JSON.stringify(events)
        }).then((data) => data.json())
        .then((data) => {
            console.log(data);
            alert("Event created, check your Google Calendar!");
        })
        .catch(error => {
            alert('Error creating event');
            console.log(error);
        });
    }

    async function getWeeklyEvents() {
        console.log('In getWeeklyEvents function');
        var completeList = [];
        for (var calendarId in calendars) {
            await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?orderBy=startTime&singleEvents=true&timeMin=${getStartOfWeek(new Date()).toISOString()}&timeMax=${getEndOfWeek(new Date()).toISOString()}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + session.provider_token
                }
            })
            .then(response => {
                console.log('Got a response from fetch');
                return response.json();
            })
            .then(events => events.items.map(ev => {
                return {
                    summary: ev.summary,
                    start: ev.start,
                    end: ev.end,
                    calendar: calendars[calendarId]
                }
            }))
            .then(events => completeList.push(...events))
            .catch(err => console.error(err));
        }
        setEventList(completeList);
        console.log('Finished getWeeklyEvents function');
    }

    return (
        <div className="app">
            <div style={{width: '400px', margin: "30px auto"}}>
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
                <div>
                    <button onClick={() => fetchCalendars()}>Fetch Calendars</button>
                    <p>{JSON.stringify(calendars, null, 4)}</p>
                    <button onClick={() => getWeeklyEvents()}>Fetch Weekly Events</button>
                    <p>{JSON.stringify(eventList, null, 4)}</p>
                </div>
            </div>
        </div>
    );
}

export default App;