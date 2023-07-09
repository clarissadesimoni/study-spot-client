import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
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
        fetchColors()
        .then((cols) => fetchCalendars(cols))
        .then((cals) => getEventsInRange(new Date(2023, 0, 1), new Date(2023, 11, 31), cals))
        .catch(error => console.log(error));
    }, []);

    async function fetchColors() {
        let colors = await fetch('https://www.googleapis.com/calendar/v3/colors', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            }
        })
        .catch(error => {
            alert('Error fetching colors');
            console.log(error.message);
        });
        colors = await colors.json();
        console.log(colors.calendar);
        return colors.calendar;
    }

    async function fetchCalendars(colors = {}) {
        const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            }
        })
        .then(response => response.json())
        .then(data => data.items.reduce((acc, cal) => {
            acc[cal.id] = {
                color: colors[cal.colorId].background,
                name: cal.summary
            };
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
                Authorization: 'Bearer ' + session.provider_token
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

    async function editEvent(eventId, calendarId, start, end, isAllDay) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let newEvent = {
            start: isAllDay ? {
                dateTime: start.toISOString(),
                timeZone: timeZone
            } : {
                date: new Intl.DateTimeFormat('en-CA', {}).format(start)
            },
            end: isAllDay ? {
                dateTime: end.toISOString(),
                timeZone: timeZone
            } : {
                date: new Intl.DateTimeFormat('en-CA', {}).format(end)
            }
        };
        let result = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(newEvent)
        });
        result = await result.json();
        return {
            id: result.id,
            title: result.summary,
            start: moment(result.start.dateTime ?? result.start.date).toDate(),
            end: moment(result.end.dateTime ?? result.end.date).toDate(),
            calendar: calendarId,
            color: calendars[calendarId].color,
            isDraggable: true,
            isResizable: true,
        }
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
                    calendar: calendarId,
                    color: (cals ?? calendars)[calendarId].color,
                    isDraggable: true,
                    isResizable: true,
                }
            }))
            .then(events => completeList.push(...events))
            .catch(err => console.error(err));
        }
        console.log('Events fetched successfully');
        setEventList(completeList);
    }

    const handleMove = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event
            if (!allDay && droppedOnAllDaySlot) {
                event.allDay = true
            }

            editEvent(event.id, event.calendar, start, end, event.isAllDay ?? false)
            .then((res) => {
                setEventList((prev) => {
                    const existing = prev.find((ev) => ev.id === event.id) ?? (res ?? {})
                    const filtered = prev.filter((ev) => ev.id !== event.id)
                    return [...filtered, { ...existing, allDay }]
                })
            })
        },
        [setEventList]
    )

    const handleResize = useCallback(
        ({ event, start, end }) => {
            editEvent(event.id, event.calendar, start, end, false)
            .then((res) => {
                setEventList((prev) => {
                    const existing = prev.find((ev) => ev.id === event.id) ?? (res ?? {})
                    const filtered = prev.filter((ev) => ev.id !== event.id)
                    return [...filtered, existing]
                })
            })
        },
        [setEventList]
    )

    function eventStyleGetter(event, start, end, isSelected) {
        var backgroundColor = event.color;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'black',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
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
                    <DragAndDropCalendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="week"
                    events={eventList}
                    step={15}
                    style={{ height: "100vh" }}
                    onEventDrop={handleMove}
                    onEventResize={handleResize}
                    eventPropGetter={(eventStyleGetter)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CalendarComponent;