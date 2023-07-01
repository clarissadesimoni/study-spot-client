import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  'https://avtaascpubpafusvroet.supabase.co',
  process.env.SUPABASE_TOKEN
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);