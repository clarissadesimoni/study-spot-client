import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

function Auth() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ bottomText, setBottomText ] = useState('');
    const [ isSignIn, setIsSignIn ] = useState(false);
    const [ isSignUp, setIsSignUp ] = useState(false);

    async function googleSignIn() {
        const { error } =  await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            },
        });
        if (error) {
            alert('Errore durante l\'accesso con Google');
            console.log(error.message);
        }
    }

    async function emailSignIn() {
        const { error } =  await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            alert('Errore durante l\'accesso con email');
            console.log(error.message);
        }
    }

    async function signUp() {
        const { error } =  await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            alert('Errore durante l\'iscrizione con email');
            console.log(error.message);
        } else {
            setBottomText('Un\'email di conferma è stata inviata a questo indirizzo email. Clicca sul link prima di effettuare l\'accesso.');
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    if (session) {
        return <button onClick={() => signOut()}>Effettua il logout</button>
    } else {
        return (
        <>
            <button onClick={() => googleSignIn()}>Entra con Google</button>
            {
                isSignIn ? (
                    <>
                        <p />
                        <input type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} />
                        <p />
                        <input type='password' autoComplete='password' onChange={(e) => setPassword(e.target.value)} />
                        <p />
                        <button onClick={() => emailSignIn()}>Invia</button>
                    </>
                ) : (
                    <>
                        <p />
                        <button onClick={() => { setIsSignIn(true); setIsSignUp(false); }}>Accedi tramite email</button>
                    </>
                )
            }
            {
                isSignUp ? (
                    <>
                        <p />
                        <input type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} />
                        <p />
                        <input type='password' autoComplete='password' onChange={(e) => setPassword(e.target.value)} />
                        <p />
                        <button onClick={() => signUp()}>Invia</button>
                        <p>{bottomText}</p>
                    </>
                ) : (
                    <>
                        <p />
                        <button onClick={() => { setIsSignIn(false); setIsSignUp(true); }}>Iscriviti</button>
                    </>
                )
            }
        </>
        )
    }
}

export default Auth;