import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export default function checkIfSignedIn() {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            return true;
        } else {
            return false;
        }
    });
}