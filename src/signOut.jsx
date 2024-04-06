import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfSignedIn, handleSignOut, logOut } from './supabaseClient';

import React, { useState } from 'react';

export default function SignOut() {
    const navigate = useNavigate();

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        checkIfSignedIn().then((r) => {
            if (r != true) {
                navigate('/');
            }
        });
    }, []);

    async function buttonClick () {
        await handleSignOut()

        navigate('/')
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100vw',
                }}
            >
                <Button
                    variant='outlined'
                    sx={{ textTransform: 'none' }}
                    onClick={() => {
                        buttonClick()
                    }}
                >
                    <Typography>Log out</Typography>
                </Button>
            </Box>
        </>
    );
}
