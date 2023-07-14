import { useEffect, useState, useCallback, useRef } from 'react';
import Select from 'react-select';
import moment from 'moment';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Modal from './Modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

function CalendarComponent() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ newStart, setNewStart ] = useState(new Date());
    const [ newEnd, setNewEnd ] = useState(new Date());
    const [ calendars, setCalendars ] = useState({});
    const [ newEventName, setNewEventName ] = useState('');
    const [ events, setEvents ] = useState([]);
    const [ selectedEvent, setSelectedEvent ] = useState(undefined);
    const [ modalState, setModalState ] = useState(false);
    const [ isAdding, setIsAdding ] = useState(false);
    let calsTmp = useRef({});
    let eventsTmp = useRef([]);
    let newEventCalendar = useRef('');

    const handleEditEvent = (event) => {
        
    }

    const handleDeleteEvent = (event) => {

    }
    
    const handleSelectedEvent = (event) => {
        if (modalState) {
            if (event.id === selectedEvent.id) {
                setModalState(false)
                setSelectedEvent(null)
            } else {
                setSelectedEvent(event)
            }
        } else {
            setSelectedEvent(event)
            setModalState(true)
        }
    }

    useEffect(() => {
        fetchCalendars()
        .then(() => getEventsInRange(new Date(2023, 0, 1), new Date(2024, 0, 1)))
        .catch(error => console.log(error));
    }, []);

    function generateRBCEvent(ev) {
        return {
            id: ev.id,
            title: ev.title,
            start: moment(ev.start).toDate(),
            end: moment(ev.end).toDate(),
            calendar: ev.calendar,
            color: calsTmp.current[ev.calendar].color,
            isAllDay: ev.isAllDay,
            isDraggable: true,
            isResizable: true,
        }
    }

    async function fetchCalendars() {
        let { data, error } = await supabase
        .from('calendars')
        .select()
        .eq('owner', session.user.id);
        if (error) {
            alert('Errore nella lettura dei calendari.');
            console.log(error.message);
        }
        if (data) {
            data = data.reduce((acc, cal) => {
                acc[cal.id] = cal;
                return acc;
            }, {});
        }
        console.log(data);
        calsTmp.current = data;
        setCalendars(data);
        return data;
    }

    async function createEvent() {
        console.log(session);
        let query = supabase
        .from('events')
        .insert([{ title: 'it works', start: moment().toDate().toISOString(), end: moment().add(2, 'hours').toDate().toISOString(), calendar: 1, owner: '43d20e86-e89f-4615-93d3-c4598abd21ec' }])
        .select();
        let { data, error } = await query;
        if (error) {
            console.log(error.message);
        }
        if (data) {
            console.log(data);
            setEvents(data);
        }
        /* const event = {
            summary: newEventName,
            start: {
                dateTime: newStart.toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: newEnd.toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${newEventCalendar.current ?? 'primary'}/events`, {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(event)
        }).then((data) => data.json())
        .then((data) => {
            eventsTmp.current = [ ...events, data ];
            setEvents(eventsTmp.current);
            setNewEventName('');
            newEventCalendar.current = '';
            setNewStart(new Date());
            setNewEnd(new Date());
            setIsAdding(false);
        })
        .catch(error => {
            alert('Error creating event');
            console.log(error);
        }); */
    }

    async function editEvent(event, start, end, isAllDay) {
        /* const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let newEvent = eventsTmp.current.find(e => e.id === event.id);
        newEvent = { ...newEvent,
            start: isAllDay ? {
                date: new Intl.DateTimeFormat('en-CA', {}).format(start).substring(0, 10)
            } : {
                dateTime: start.toISOString(),
                timeZone: timeZone
            },
            end: isAllDay ? {
                date: new Intl.DateTimeFormat('en-CA', {}).format(end).substring(0, 10)
            } : {
                dateTime: end.toISOString(),
                timeZone: timeZone
            }
        }
        let result = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${event.calendar}/events/${event.id}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(newEvent)
        });
        result = await result.json();
        return result; */
    }

    async function getEventsInRange(start, end) {
        console.log(session);
        let { data, error } = await supabase
        .from('events')
        .select()
        // .eq('owner', session.user.id)
        // .gte('start', start.toISOString())
        // .lt('end', end.toISOString());
        if (error) {
            console.log(error.message);
        }
        if (data) {
            console.log(data);
            setEvents(data);
        }
        /* var completeList = [];
        for (var calendarId in (cals ?? calsTmp.current ?? calendars)) {
            await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?orderBy=startTime&singleEvents=true&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + session.provider_token
                }
            })
            .then(response => {
                return response.json();
            })
            .then(events => {
                completeList.push(...events.items);
                return completeList;
            })
            .catch(err => console.error(err));
        }
        eventsTmp.current = completeList;
        setEvents(completeList); */
    }

    /* const handleMove = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event
            if (!allDay && droppedOnAllDaySlot) {
                event.allDay = true
            }
            editEvent(event, start, end, event.allDay ?? false)
            .then((res) => {
                setEvents((prev) => {
                    const filtered = prev.filter((ev) => ev.id !== event.id);
                    eventsTmp.current = [ ...filtered, res ];
                    return eventsTmp.current;
                })
            })
        },
        [setEvents]
    )

    const handleResize = useCallback(
        ({ event, start, end }) => {
            editEvent(event, start, end, false)
            .then((res) => {
                setEvents((prev) => {
                    const filtered = prev.filter((ev) => ev.id !== event.id);
                    eventsTmp.current = [ ...filtered, res ];
                    return eventsTmp.current;
                })
            })
        },
        [setEvents]
    ) */

    function eventStyleGetter(event, start, end, isSelected) {
        var backgroundColor = event.color;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '6px',
            opacity: 1,
            color: 'black',
            border: '1px solid black',
            display: 'block'
        };
        return {
            style: style
        };
    }

    return (
        <div className="calendar-div">
            <div className='calendar-add-event-div'>
            {
                isAdding ? (
                    <>
                        <p>Name of event:</p>
                        <input className='calendar-input' type="text" onChange={(e) => setNewEventName(e.target.value)} />
                        <div className='select calendar-select'>
                            <Select options={Object.entries(calsTmp.current).map(([k, v]) => {
                                return {
                                    value: k,
                                    label: v.name
                                }
                            })} defaultValue={''} onChange={selected => newEventCalendar.current = selected.value} isClearable={true} isSearchable={true} />
                        </div>
                        <p>Start of event:</p>
                        <div className='rdtp'>
                            <DateTimePicker onChange={setNewStart} value={newStart} />
                        </div>
                        <p>End of event:</p>
                        <div className='rdtp'>
                            <DateTimePicker onChange={setNewEnd} value={newEnd} />
                        </div>
                        <button className='btn calendar-btn' onClick={() => createEvent()}>Create calendar event</button>
                    </>
                ) : (
                    <button className='btn calendar-btn' onClick={() => setIsAdding(true)}>Aggiungi un evento</button>
                )
            }
            </div>
            <div>
                <hr />
                {selectedEvent && modalState && <Modal event_obj={selectedEvent} editFunc={handleEditEvent} deleteFunc={handleDeleteEvent} />}
                <div className='calendar-container'>
                    <DragAndDropCalendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="week"
                        events={eventsTmp.current.map(e => generateRBCEvent(e))}
                        step={15}
                        style={{ height: "80vh" }}
                        // onEventDrop={handleMove}
                        // onEventResize={handleResize}
                        eventPropGetter={(eventStyleGetter)}
                        onSelectEvent={(e) => handleSelectedEvent(e)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CalendarComponent;