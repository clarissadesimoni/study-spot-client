import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import '../styles/styles.css';

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
        return (
            <div className="auth-div-logout">
                <button className='btn auth-btn' onClick={() => signOut()}>Effettua il logout</button>
            </div>
        )
    } else {
        return (
            <>
                <div className="email-login-div">
                    <button className='btn auth-btn' onClick={() => googleSignIn()}>Entra con Google</button>
                    {
                        isSignIn ? (
                            <>
                                <input className='auth-input' type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                                <input className='auth-input' type='password' autoComplete='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                                <button className='btn auth-btn' onClick={() => emailSignIn()}>Invia</button>
                            </>
                        ) : (
                            <>
                                <button className='btn auth-btn' onClick={() => { setIsSignIn(true); setIsSignUp(false); }}>Accedi tramite email</button>
                            </>
                        )
                    }
                </div>
                <div className="email-signup-div">
                    {
                        isSignUp ? (
                            <>
                                <input className='auth-input' type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                                <input className='auth-input' type='password' autoComplete='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                                <button className='btn auth-btn' onClick={() => signUp()}>Invia</button>
                                <p>{bottomText}</p>
                            </>
                        ) : (
                            <>
                                <button className='btn auth-btn' onClick={() => { setIsSignIn(false); setIsSignUp(true); }}>Iscriviti</button>
                            </>
                        )
                    }
                </div>
            </>
        )
    }
}

export default Auth;