import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Auth, CalendarComponent,  TaskManager } from './components';
import { TMApiContextProvider, TMProjectsContextProvider, TMLabelsContextProvider, TMFilterContextProvider } from './contexts/TMContext';

function App() {

    const session = useSession();
    const [ section, setSection ] = useState('calendar');

    return (
        <div className="app">
            <div className="sections">
                <button onClick={() => setSection('calendar')}>Calendar</button>
                <p />
                <button onClick={() => setSection('tasks')}>Attività</button>
            </div>
            <div style={{width: '800px', margin: "30px auto"}}>
                {
                    session &&
                    <>
                        {
                            section.localeCompare('calendar') == 0 ?
                            <CalendarComponent />
                            :
                            section.localeCompare('tasks') == 0 ?
                            <TMApiContextProvider children={<TMProjectsContextProvider children={<TMLabelsContextProvider children={<TMFilterContextProvider children={<TaskManager />} />} />} />} />
                            :
                            <></>
                        }
                        <hr />
                    </>
                }
                <Auth />
            </div>
        </div>
    );
}

export default App;
