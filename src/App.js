import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Auth, CalendarComponent, GoogleCalendarComponent,  TaskManager } from './components';
import { TMApiContextProvider, TMProjectsContextProvider, TMLabelsContextProvider, TMFilterContextProvider } from './contexts/TMContext';

import './styles/styles.css';

function App() {

    const session = useSession();
    const [ section, setSection ] = useState('calendar');

    if (session) {
        console.log(session.user);
        return (
            <div className="App">
                <Auth />
                <div className="sections-div">
                    <button className='btn sections-btn' onClick={() => setSection('calendar')}>Calendar</button>
                    <button className='btn sections-btn' onClick={() => setSection('tasks')}>Attività</button>
                </div>
                <div className="content-div">
                    {
                        section.localeCompare('calendar') == 0 ?
                        (session.user.identities[0].provider.localeCompare('google') == 0 ?
                        <GoogleCalendarComponent />
                        :
                        <CalendarComponent />)
                        :
                        section.localeCompare('tasks') == 0 ?
                        <TMApiContextProvider children={<TMProjectsContextProvider children={<TMLabelsContextProvider children={<TMFilterContextProvider children={<TaskManager />} />} />} />} />
                        :
                        <></>
                    }
                </div>
            </div>
        );
    }
    else return (
        <div className="App">
            <Auth />
        </div>
    );
}

export default App;
