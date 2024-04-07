import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdateLogOutTime, getUsername, logOut } from './supabaseClient';

import React, { useState } from 'react';

export default function Profile() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (username == '') {
            getUsername().then((r) => {
                setUsername(r);
            });
        }
    }, []);

    async function buttonClick() {
        await UpdateLogOutTime();
        await logOut();

        navigate('/');
    }

    return (
        <>
            <Box
                sx={{
                    mt: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100vw',
                    gap: '30px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        color: '#d32f2f',
                    }}
                >
                    <Button
                        variant='outlined'
                        sx={{
                            borderRadius: '10px',
                            borderColor: '#d32f2f',
                            backgroundColor: '#d32f2f40',
                            padding: '20px 50px',
                        }}
                        onClick={() => buttonClick()}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Nunito',
                                fontWeight: '600',
                                fontSize: '1.6rem',
                                color: '#d32f2f',
                                textTransform: 'none',
                            }}
                        >
                            Log Out
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </>
    );
}
