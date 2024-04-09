import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdateLogOutTime, getEmail, logOut } from './supabaseClient';

import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Profile() {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (email == '') {
            getEmail().then((r) => {
                setEmail(r);
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
                    height: '50dvh',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '20px 30px',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'Nunito',
                        fontWeight: '600',
                        fontSize: '1.6rem',
                        color: 'primary.main',
                        textTransform: 'none',
                    }}
                >
                    {email && email}
                </Typography>
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
                            padding: '10px 30px',
                        }}
                        onClick={() => buttonClick()}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Nunito',
                                fontWeight: '600',
                                fontSize: '1.3rem',
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
