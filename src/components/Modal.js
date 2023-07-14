function Modal({ event_obj, editFunc, deleteFunc }) {
    return (
        <div className={'modal-show'}>
            <p>{event_obj.title}</p>
            <p>Inizio - Fine</p>
            <p />
            <button className='btn calendar-btn' onClick={() => editFunc(event_obj)}>Rinomina</button>
            <button className='btn calendar-btn' onClick={() => deleteFunc(event_obj)}>Elimina</button>
        </div>
    )
}

export default Modal;