import { createClient } from '@supabase/supabase-js';
import { enqueueSnackbar } from 'notistack';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;

let supabase = 'fo1';
supabase == 'fo1' && (supabase = createClient(supabaseUrl, supabaseKey));

export async function checkIfSignedIn() {
    let returnThis;
    await supabase.auth.getSession().then((r) => {
        r.data
            ? r.data.session == null
                ? (returnThis = false)
                : (returnThis = true)
            : console.log(r);
    });
    return returnThis && returnThis;
}

export async function getEmail() {
    let returnThis = 'nothin';

    await supabase.auth.getUser().then((response) => {
        response.data.user.email
            ? (returnThis = response.data.user.email)
            : console.log(response);
    });
    return returnThis !== 'nothin' && returnThis;
}

export async function setUsername(newUsername) {
    const email = getEmail()
    const { data, error, status, statusText } = await supabase
        .from('usernames')
        .insert([{ username: newUsername, email: email }])
        .select();

    if (error) {
        // Handle error
        enqueueSnackbar(error.message, {
            variant: 'error',
            preventDuplicate: true,
        });
        return { success: false, message: error.message };
    }

    // Data successfully inserted
    return { success: true, status, statusText };
}

export async function setPassword(newPassword) {
    let response = 'nothin';
    await supabase.auth.updateUser({ password: newPassword }).then((r) => {
        response = r;
    });

    return response !== 'nothin' && response
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
    supabase.auth
        .signOut()
        .then((r) => {
            if (!r.data) {
                console.log('User signed out successfully', r);
                enqueueSnackbar('Log out success', {
                    variant: 'success',
                    preventDuplicate: true,
                });
            } else {
                console.log('User still signed in:', r);
                enqueueSnackbar(
                    'An error has occurred. Check console for more information.',
                    { variant: 'error', preventDuplicate: true }
                );
            }
        })
        .catch((error) => {
            console.error('Error during sign out:', error);
            enqueueSnackbar(
                'An error has occurred during sign out. Please try again later.',
                { variant: 'error', preventDuplicate: true }
            );
        });
}
