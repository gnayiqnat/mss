import { createClient } from '@supabase/supabase-js';
import { enqueueSnackbar } from 'notistack';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;

let supabase;
!supabase && (supabase = createClient(supabaseUrl, supabaseKey));

export function checkIfSignedIn() {
    if (supabase.auth.getSession() === true) {
        return true;
    } else {
        return false;
    }
}

export function signIn(CEV, CPV) {
    return new Promise((resolve, reject) => {
        let status = 'NOTHING:(';
        supabase.auth
            .signInWithPassword({
                email: CEV,
                password: CPV,
            })
            .then((response) => {
                if (response.data.user) {
                    status = true;
                    resolve(status);
                } else {
                    enqueueSnackbar(response.error.message, {
                        variant: 'error',
                        preventDuplicate: true,
                    });
                    status = response.error.message;
                    reject(status);
                }
            })
            .catch((error) => {
                // Handle other errors
                enqueueSnackbar(error.message, {
                    variant: 'error',
                    preventDuplicate: true,
                });
                reject(error.message);
            });
    });
}


export function logOut() {
    if (checkIfSignedIn()) {
        supabase.auth.signOut();
        enqueueSnackbar('Log out success', {
            variant: 'success',
            preventDuplicate: true,
        });
    } else {
        enqueueSnackbar(
            'An error has occured. Check console for more information.',
            { variant: 'error' }
        );
    }
}
