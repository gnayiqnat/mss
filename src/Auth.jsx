import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import {
    Button,
    InputAdornment,
    Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import * as React from 'react';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Auth({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [scope, animate] = useAnimate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    // Current Email & Password Value
    const [CEV, setCEV] = useState('');
    const [CPV, setCPV] = useState('');

    function handleSignInSuccess() {
        enqueueSnackbar("You're now logged in.", {
            variant: 'success',
            preventDuplicate: true
        }),
            setTimeout(() => {
                enqueueSnackbar('Redirecting, please wait.', {
                    variant: 'info',
                    preventDuplicate: true,
                });
            }, 1000),
            animate(scope.current, { opacity: 0 }, { duration: 0.5 });
        setTimeout(() => {
            navigate('/success');
        }, 2500);
    }

    function handleSubmit() {
        if (CEV && CPV) {
            supabase.auth
                .signInWithPassword({
                    email: CEV,
                    password: CPV,
                })
                .then((response) => {
                    response.data.user
                        ? handleSignInSuccess()
                        : (enqueueSnackbar(response.error.message, {
                              variant: 'error',
                              preventDuplicate: true
                          }),
                          response.error.message ===
                              'Invalid login credentials' &&
                              (animate(
                                  scope.current,
                                  { opacity: 0 },
                                  { duration: 0.5 }
                              ),
                              setTimeout(() => {
                                  setCEV('');
                                  setCPV('');
                                  animate(
                                      scope.current,
                                      { opacity: 1 },
                                      { duration: 0.5 }
                                  );
                              }, 750)));
                });
        } else {
            enqueueSnackbar('Fields cannot be empty', {
                variant: 'error',
            });
        }
        
    }


    return (
        <>
            <Box ref={scope} sx={{ opacity: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',

                        width: '96vw',
                        height: '96dvh',
                    }}
                >
                    <>
                        <Typography
                            align='center'
                            sx={{
                                fontSize: '1.8rem',
                                fontFamily: 'Nunito',
                                fontWeight: '500',
                                mb: 3,
                                mt: -2,
                            }}
                        >
                            Log in
                        </Typography>
                        <Box
                            noValidate
                            sx={{
                                width: 'clamp(70vw, 80vw, 400px)',
                                maxWidth: '400px',
                            }}
                        >
                            <TextField
                                onKeyDown={(e) => {
                                    e.key === 'Enter' && handleSubmit();
                                }}
                                margin='normal'
                                required
                                fullWidth
                                variant='standard'
                                name='email'
                                type='email'
                                placeholder='User ID'
                                color='primary'
                                value={CEV}
                                inputProps={{
                                    style: { fontSize: '18px' },
                                }}
                                onChange={(e) => {
                                    setCEV(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position='start'
                                            sx={{ mr: '14px' }}
                                        >
                                            <PersonOutlineRoundedIcon
                                                sx={{
                                                    color: '#000000',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),

                                    sx: {
                                        padding: '10px 10px',
                                    },
                                }}
                            />
                            <TextField
                                onKeyDown={(e) => {
                                    e.key === 'Enter' && handleSubmit();
                                }}
                                margin='normal'
                                required
                                fullWidth
                                variant='standard'
                                name='password'
                                type='password'
                                placeholder='Password'
                                color='primary'
                                value={CPV}
                                inputProps={{
                                    style: { fontSize: '18px' },
                                }}
                                onChange={(e) => {
                                    setCPV(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position='start'
                                            sx={{ mr: '14px' }}
                                        >
                                            <LockOpenIcon
                                                sx={{
                                                    color: '#000000',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),

                                    sx: {
                                        padding: '10px 10px',
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    mt: 5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        padding: '15px',
                                        width: '100%',
                                        borderRadius: '80px',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                        },
                                    }}
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            opacity: 0.7,
                                            fontFamily: 'Nunito',
                                            textTransform: 'none',
                                            color: 'hsl(216, 18%, 85%)',
                                            fontWeight: '600',
                                            fontSize: '18px',
                                        }}
                                    >
                                        Submit
                                    </Typography>
                                </Button>
                            </Box>
                        </Box>
                    </>
                </Box>
                {!isMobile && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            mt: -5,
                            padding: '0px 25px',
                        }}
                    >
                        <Button
                            onClick={() => {
                                window.open('/privacypolicy');
                            }}
                            sx={{
                                textTransform: 'none',
                                '&:hover': { backgroundColor: 'transparent' },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'Nunito',
                                    color: 'primary.main',
                                }}
                            >
                                <u> Privacy Policy</u>{' '}
                            </Typography>
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
}
