import { Button } from '@mui/material';
import { logOut } from './supabaseClient';

export default function SignOut() {
    return (
        <>
            <Button
                onClick={() => {
                    logOut();
                }}
            >
                Log out{' '}
            </Button>
        </>
    );
}
