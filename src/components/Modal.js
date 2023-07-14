function Modal({ event_obj, editFunc, deleteFunc }) {
    var dtf = new Intl.DateTimeFormat('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    var df = new Intl.DateTimeFormat('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Rome' });
    var tf = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });

    return (
        <div className={'modal-show'}>
            <p>{event_obj.title}</p>
            {
                event_obj.isAllDay ?
                <p>{df.format(event_obj.start)} - {df.format(event_obj.end)}</p>
                :
                (
                    <p>{dtf.format(event_obj.start)} - { df.format(event_obj.start).localeCompare(df.format(event_obj.end)) == 0 ? tf.format(event_obj.end) : dtf.format(event_obj.end)}</p>
                )
            }
            <p />
            <button className='btn calendar-btn' onClick={() => editFunc(event_obj)}>Rinomina</button>
            <button className='btn calendar-btn' onClick={() => deleteFunc(event_obj)}>Elimina</button>
        </div>
    )
}

export default Modal;