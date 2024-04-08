import { createClient } from '@supabase/supabase-js';
import { enqueueSnackbar } from 'notistack';
import moment from 'moment';
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

export async function getUsername() {
    try {
        const { data, error } = await supabase.from('usernames').select('*');

        if (error) throw error;

        return data[0].username; // Return the fetched data
    } catch (error) {
        console.error('Error fetching username:', error);
        return null; // Or return something that indicates an error
    }
}

export async function setUsername(newUsername) {
    const email = getEmail();

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

    return response !== 'nothin' && response;
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

export async function logOut() {
    try {
        await supabase.auth.signOut();
        console.log('User signed out successfully');
        enqueueSnackbar('Log out success', {
            variant: 'success',
            preventDuplicate: true,
        });
    } catch (error) {
        console.error('Error during sign out:', error);
        enqueueSnackbar(
            'An error has occurred during sign out. Please try again later.',
            { variant: 'error', preventDuplicate: true }
        );
    }
}

export async function getStudentDetails() {
    let username;
    await getUsername().then((r) => {
        username = r;
    });

    const { data, error } = await supabase
        .from('user_sessions')
        .select('student_name, student_class')
        .eq('username', username)
        .eq('sign_out_time', '')
        .select('*'); // Check for empty string

    return error ? error : data;
}
export async function CheckExistingSession() {
    let username;
    await getUsername().then((r) => {
        username = r;
    });
    const { data: existingSessions, error: fetchError } = await supabase
        .from('user_sessions')
        .select('sign_out_time')
        .eq('username', username)
        .eq('sign_out_time', ''); // Check for empty string

    if (fetchError) throw fetchError;

    if (existingSessions.length > 0) {
        return true;
    }

    return false;
}

export async function LogSignInTime(studentName, studentClass) {
    let username;
    await getUsername().then((r) => {
        username = r;
    });

    const currentTime = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

    try {
        // Create a new session
        const { data: newData, error: newError } = await supabase
            .from('user_sessions')
            .insert([
                {
                    username: username,
                    sign_in_time: currentTime,
                    student_name: studentName,
                    student_class: studentClass,
                },
            ]);

        if (newError) throw newError;
        console.log('Sign-in time logged');
    } catch (error) {
        console.error('Error logging sign-in time:', error);
        return 'Something went wrong. Please check console for more information.';
    }
}

export async function UpdateLogOutTime(id) {
    const currentTime = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

    try {
        const { data, error } = await supabase
            .from('user_sessions')
            .update({ sign_out_time: currentTime })
            .eq('sign_out_time', '')
            .eq('id', id) // Assuming 'id' variable is defined
            .select();

        if (error) {
            console.error('Error updating sign-out time:', error); // Log the complete error object
            throw error;
        }
    } catch (error) {
        if (error.code === '22P02') {
            await supabase
                .from('user_sessions')
                .update({ reason: 'User logged out' })
                .eq('sign_out_time', '')
                .select();

            await supabase
                .from('user_sessions')
                .update({ sign_out_time: currentTime })
                .eq('sign_out_time', '')
                .select();
        }
        console.error('Error in UpdateLogOutTime:', error);
    }
}

export function calculateSessionStatus(signInTimeStr) {
    // Define the sign-in time
    const signInTime = moment(signInTimeStr, 'MMMM D, YYYY at h:mm A');

    // Get the current time
    const now = moment();

    // Calculate the time difference
    const duration = moment.duration(now.diff(signInTime));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60; // Minutes remaining after hours

    // Output the result
    if (hours > 0) {
        return `Active for ${hours} hours`;
    } else {
        return `Active for ${minutes} minutes`;
    }
}

export async function getGrades() {
    let { data, error } = await supabase.from('grade list').select('*');
    return (data[0].list_of_grades);
}
