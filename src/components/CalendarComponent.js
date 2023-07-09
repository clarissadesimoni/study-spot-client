import { useEffect, useState } from 'react';
import moment from 'moment';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { getStartOfWeek, getEndOfWeek } from '../utilities/dates';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

function CalendarComponent() {

    const session = useSession();
    const [ start, setStart ] = useState(new Date());
    const [ end, setEnd ] = useState(new Date());
    const [calendars, setCalendars ] = useState({});
    const [ eventName, setEventName ] = useState('');
    const [ eventList, setEventList ] = useState([]);

    useEffect(() => {
        fetchCalendars()
        .then((cals) => getEventsInRange(new Date(2023, 0, 1), new Date(2023, 11, 31), cals))
        .then(() => fetchColors())
        .catch(error => console.log(error));
    }, []);

    function fetchColors() {
        fetch('https://www.googleapis.com/calendar/v3/colors', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => {
            alert('Error fetching colors');
            console.log(error.message);
        });
    }

    async function fetchCalendars() {
        const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            }
        })
        .then(response => response.json())
        .then(data => data.items.reduce((acc, cal) => {
            console.log(cal.colorId);
            acc[cal.id] = cal.summary;
            return acc;
        }, {}))
        .catch(error => {
            alert('Error fetching calendars');
            console.log(error.message);
        });
        console.log('Calendars fetched');
        setCalendars(res);
        return res;
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
                Authorization: 'Bearer ' + session.provider_token // Access token for google
            },
            body: JSON.stringify(event)
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

    async function getEventsInRange(start, end, cals = null) {
        var completeList = [];
        for (var calendarId in (cals ?? calendars)) {
            await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?orderBy=startTime&singleEvents=true&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + session.provider_token
                }
            })
            .then(response => {
                return response.json();
            })
            .then(events => events.items.map(ev => {
                return {
                    id: ev.id,
                    title: ev.summary,
                    start: moment(ev.start.dateTime ?? ev.start.date).toDate(),
                    end: moment(ev.end.dateTime ?? ev.end.date).toDate(),
                    calendar: calendars[calendarId],
                    isDraggable: true,
                }
            }))
            .then(events => completeList.push(...events))
            .catch(err => console.error(err));
        }
        console.log('Events fetched successfully');
        setEventList(completeList);
    }

    function handleResize(event, start, end) {
        console.log(event);
    }

    return (
        <div className="app">
            <div style={{margin: "30px auto"}}>
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
                    {/* <button onClick={() => getWeeklyEvents()}>Fetch Weekly Events</button>
                    <p>{JSON.stringify(eventList, null, 4)}</p> */}
                    {/* <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="week"
                    events={eventList}
                    style={{ height: "100vh" }}
                    /> */}
                    {/* <DragAndDropCalendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="week"
                    events={eventList}
                    style={{ height: "100vh" }}
                    /> */}
                </div>
            </div>
        </div>
    );
}

export default CalendarComponent;