import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

function TaskManager() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ token, setToken ] = useState('');

    async function getToken() {
        await supabase.from()
    }

    return (
        <>
        
        </>
    );
}

export default TaskManager;