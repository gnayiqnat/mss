import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogSignInTime,
    UpdateLogOutTime,
    checkIfSignedIn,
    getEmail,
    getUsername,
    handleSignOut,
} from './supabaseClient';
import { enqueueSnackbar } from 'notistack';

export default function Success() {
    const navigate = useNavigate();

    const [username, setUsername] = useState(false);

    useEffect(() => {
        checkIfSignedIn().then((isSignedIn) => {
            if (isSignedIn != true) {
                navigate('/');
            }
        });

        if (!username) {
            getUsername().then((r) => {
                r && setUsername(r[0].username);
            });
        }
    }, []);


    async function pushSignIn() {
        if (!username) {
            enqueueSnackbar(`No username found`, {variant: 'error'})
            navigate('/set-username')
        } else {
            LogSignInTime(username).then((r) =>
                r
                    ? enqueueSnackbar(r, {
                          variant: 'error',
                          preventDuplicate: true,
                      })
                    : (enqueueSnackbar('Logged successfully', {
                          variant: 'success',
                          preventDuplicate: true,
                      }), navigate('/signout'))
            );
        }
    }
    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: '95dvh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <Typography sx={{ fontFamily: 'Nunito', fontSize: '1.5rem' }}>
                    Is this you?
                </Typography>
                <Typography
                    align='center'
                    sx={{
                        fontSize: '1.1rem',
                        fontFamily: 'Nunito',
                        fontWeight: '500',
                        opacity: 0.5,
                    }}
                >
                    ( {username} ){' '}
                </Typography>
                <Button
                    onClick={() => {
                        pushSignIn();
                    }}
                >
                    Yes
                </Button>
            </Box>
        </>
    );
}
