import { useEffect, useState } from 'react';
import {
    checkIfSignedIn,
    getEmail,
    getUsername,
    setUsername,
} from './supabaseClient';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { PersonOutlineRounded } from '@mui/icons-material';

export default function SetUsername() {
    const [scope, animate] = useAnimate();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [isLoading, setIsLoading] = useState(false);

    // User details
    const [userEmail, setUserEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        checkIfSignedIn().then((isSignedIn) => {
            if (isSignedIn != true) {
                enqueueSnackbar('Please log in', {
                    variant: 'error',
                    preventDuplicate: true,
                });
                navigate('/');
            }
            getUsername().then((r) => {
                r && (navigate('/'), enqueueSnackbar('Username has already been set', {variant: 'error', preventDuplicate: true}));
            });
            
            if (!userEmail) {
                getEmail().then((r) => {
                    r && setUserEmail(r);
                });
            }
        });
    }, []);

    async function handleSubmit() {
        setIsLoading(true);

        if (newUsername) {
            try {
                const response = await setUsername(newUsername);
                console.log(response)
                if ((response) && response.status === 201) {
                    enqueueSnackbar('Username change success', {
                        variant: 'success',
                    });
                    enqueueSnackbar('Redirecting you', { variant: 'info' });
                    animate(
                        scope.current,
                        { opacity: 0 },
                        { duration: 0.5 },
                        
                    )
                    setTimeout(() => navigate('/'), 750)
                } else {
                    enqueueSnackbar(response.error.message, {
                        variant: 'error',
                    });
                    setNewUsername('');
                }
            } catch (error) {
                console.error('Error occurred:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            enqueueSnackbar('Fields cannot be empty', {
                variant: 'error',
            });
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                {' '}
                <Box
                    ref={scope}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100vw',
                        height: '100dvh',
                    }}
                >
                    {' '}
                    <Box
                        sx={{
                            margin: '0 auto',
                            width: '50vw',
                            maxWidth: '400px',

                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            align='center'
                            sx={{
                                fontSize: isMobile ? '1.6rem' : '1.8rem',
                                fontFamily: 'Nunito',
                                fontWeight: '500',
                                mb: 1,
                            }}
                        >
                            Create a username
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
                            {userEmail}
                        </Typography>
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            variant='standard'
                            name='username'
                            type='text'
                            placeholder='Username'
                            color='primary'
                            value={newUsername}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSubmit()
                            }
                            inputProps={{
                                style: { fontSize: '18px' },
                            }}
                            onChange={(e) => {
                                setNewUsername(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position='start'
                                        sx={{ mr: '14px' }}
                                    >
                                        <PersonOutlineRounded
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
                        <SubmitButton
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}

function SubmitButton({ handleSubmit, isLoading }) {
    return (
        <>
            <Box
                sx={{
                    mt: 5,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '110%',
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
                    {isLoading ? (
                        <CircularProgress
                            size={'27px'}
                            sx={{ color: 'hsl(216, 18%, 85%)' }}
                        />
                    ) : (
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
                    )}
                </Button>{' '}
            </Box>
        </>
    );
}
