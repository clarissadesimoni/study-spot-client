import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Auth, CalendarComponent,  TaskManager } from './components';
import { TMApiContextProvider, TMProjectsContextProvider, TMLabelsContextProvider, TMFilterContextProvider } from './contexts/TMContext';

function App() {

    const session = useSession();
    const [ section, setSection ] = useState('calendar');

    if (session) return (
        <div className="App">
            <div className="sections-div">
                <button className='btn sections-btn' onClick={() => setSection('calendar')}>Calendar</button>
                <button className='btn sections-btn' onClick={() => setSection('tasks')}>Attività</button>
            </div>
            <div className="content-div">
                {
                    section.localeCompare('calendar') == 0 ?
                    <CalendarComponent />
                    :
                    section.localeCompare('tasks') == 0 ?
                    <TMApiContextProvider children={<TMProjectsContextProvider children={<TMLabelsContextProvider children={<TMFilterContextProvider children={<TaskManager />} />} />} />} />
                    :
                    <></>
                }
                <Auth />
            </div>
        </div>
    );
    else return (
        <div className="App">
            <Auth />
        </div>
    );
}

export default App;
