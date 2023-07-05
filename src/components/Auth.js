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
            alert('Error signing in with google');
            console.log(error.message);
        }
    }

    async function emailSignIn() {
        const { error } =  await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            alert('Error signing in with email');
            console.log(error.message);
        }
    }

    async function signUp() {
        console.log({
            email: email,
            password: password
        });
        const { error } =  await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            alert('Error signing up with email');
            console.log(error.message);
        } else {
            setBottomText('A confirmation email has been sent to your email address. Click on the link before signing in.');
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    if (session) {
        return <button onClick={() => signOut()}>Sign out</button>
    } else {
        return (
        <>
            <button onClick={() => googleSignIn()}>Sign in with Google</button>
            {
                isSignIn ? (
                    <>
                        <p />
                        <input type='email' autoComplete='email' onchange={(e) => setEmail(e.target.value)} />
                        <p />
                        <input type='password' autoComplete='password' onchange={(e) => setPassword(e.target.value)} />
                        <p />
                        <button onClick={() => emailSignIn()}>Submit</button>
                    </>
                ) : (
                    <>
                        <p />
                        <button onClick={() => { setIsSignIn(true); setIsSignUp(false); }}>Sign in with email</button>
                    </>
                )
            }
            {
                isSignUp ? (
                    <>
                        <p />
                        <input type='email' autoComplete='email' onchange={(e) => setEmail(e.target.value)} />
                        <p />
                        <input type='password' autoComplete='password' onchange={(e) => setPassword(e.target.value)} />
                        <p />
                        <button onClick={() => signUp()}>Submit</button>
                        <p>{bottomText}</p>
                    </>
                ) : (
                    <>
                        <p />
                        <button onClick={() => { setIsSignIn(false); setIsSignUp(true); }}>Sign up</button>
                    </>
                )
            }
        </>
        )
    }
}

export default Auth;