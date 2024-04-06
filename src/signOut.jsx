import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfSignedIn, handleSignOut, logOut } from './supabaseClient';

import React, { useState } from 'react';

export default function SignOut() {
    const navigate = useNavigate();

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        if (isSignedIn == false) {
            checkIfSignedIn().then((result) => {
                if (result == true) {
                    setIsSignedIn(true);
                } else {
                    navigate('/');
                }
            });
        }
    }, [isSignedIn]);


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
                        handleSignOut(), setIsSignedIn(false);
                    }}
                >
                    <Typography>Log out</Typography>
                </Button>
            </Box>
        </>
    );
}
