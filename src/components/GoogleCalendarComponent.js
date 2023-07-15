import { useEffect, useState, useCallback, useRef } from 'react';
import Select from 'react-select';
import moment from 'moment';
import 'moment/locale/it';
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

function GoogleCalendarComponent() {

    const session = useSession();
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
        fetchColors()
        .then((cols) => fetchCalendars(cols))
        .then((cals) => getEventsInRange(new Date(2023, 0, 1), new Date(2023, 11, 31), cals))
        .catch(error => console.log(error));
    }, []);

    function generateRBCEvent(ev) {
        return {
            id: ev.id,
            title: ev.summary,
            start: moment(ev.start.dateTime ?? ev.start.date).toDate(),
            end: moment(ev.end.dateTime ?? ev.end.date).toDate(),
            calendar: ev.organizer.email,
            color: (calsTmp.current[ev.organizer.email] ?? session.user.email).color,
            isAllDay: !ev.start.dateTime,
            isDraggable: true,
            isResizable: true,
        }
    }

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
        calsTmp.current = res;
        setCalendars(res);
        return res;
    }

    async function createEvent() {
        const event = {
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
        });
    }

    async function editEvent(event, start, end, isAllDay) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
        return result;
    }

    async function getEventsInRange(start, end, cals = null) {
        var completeList = [];
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
        setEvents(completeList);
    }

    const handleMove = useCallback(
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
    )

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
                        culture='it'
                        defaultDate={new Date()}
                        defaultView="week"
                        events={eventsTmp.current.map(e => generateRBCEvent(e))}
                        step={15}
                        style={{ height: "70vh" }}
                        onEventDrop={handleMove}
                        onEventResize={handleResize}
                        eventPropGetter={(eventStyleGetter)}
                        onSelectEvent={(e) => handleSelectedEvent(e)}
                        messages={{
                            today: 'Oggi',
                            previous: 'Indietro',
                            next: 'Avanti',
                            month: 'Mese',
                            week: 'Settimana',
                            day: 'Giorno',
                            work_week: 'Settimana lavorativa',
                            yesterday: 'Ieri',
                            tomorrow: 'Domani',
                            agenda: 'Elenco',
                            allDay: 'Tutto il giorno',
                            date: 'Giorno',
                            event: 'Evento',
                            noEventsInRange: 'Nessun evento in questo periodo.',
                            showMore: (total) => `+${total} in più`,
                            time: 'Orario'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default GoogleCalendarComponent;