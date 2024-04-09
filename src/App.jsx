import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    styled
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Auth from './Auth.jsx';

import {
    MaterialDesignContent,
    SnackbarProvider,
    closeSnackbar,
    enqueueSnackbar,
} from 'notistack';
import { useMediaQuery } from 'react-responsive';
import FourOFourPage from './404.jsx';
import ForgotPassword from './forgotPassword.jsx';
import NewInputPage from './newInputPage.jsx';
import Profile from './profile.jsx';
import SetPassword from './setPassword.jsx';
import SetUsername from './setUsername.jsx';
import {
    UpdateLogOutTime,
    checkIfSignedIn,
    getUserDetails,
    getUsername,
    logOut,
} from './supabaseClient.jsx';
// import PrivacyPolicy from './privacyPolicy.jsx';

const routes = [
    '/',
    '/dashboard',
    '/profile',
    '/set-username',
    '/set-password',
    '/forgot-password',
];

export default function App() {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate('/');

    useEffect(() => {
        checkIfSignedIn().then((r) => {
            if (r == true) {
                setIsLoggedIn(true);
            } else {
                if (
                    location.pathname != '/' &&
                    routes.includes(location.pathname)
                ) {
                    navigate('/');
                }
            }
        });
    }, []);

    const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
        '&.notistack-MuiContent-success': {
            backgroundColor: 'rgba(56, 142, 60, 0.28)',
            padding: '8px 18px 8px 18px',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgba(56, 142, 60, 0.1)',
            boxShadow: '0px 0px 25px rgba(56, 142, 60, 0.25)',

            fontFamily: 'Nunito',
            fontSize: '16.8px',
            fontWeight: '600',
            color: '#1b5e20',
        },
        '&.notistack-MuiContent-info': {
            backgroundColor: 'rgba(2, 136, 209, 0.25)',
            padding: '8px 18px 8px 18px',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgba(2, 136, 209, 0.1)',
            boxShadow: '0px 0px 25px rgba(2, 136, 209, 0.25)',

            fontFamily: 'Nunito',
            fontSize: '16.8px',
            fontWeight: '600',
            color: '#01579b',
        },
        '&.notistack-MuiContent-error': {
            backgroundColor: 'rgb(211, 47, 47, 0.25)',
            padding: '8px 18px 8px 18px',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgb(211, 47, 47, 0.1)',
            boxShadow: '0px 0px 25px rgb(211, 47, 47, 0.25)',

            fontFamily: 'Nunito',
            fontSize: '16.8px',
            fontWeight: '600',
            color: 'rgb(211, 47, 47)',
        },
    }));

    window.addEventListener('beforeunload', async function (event) {
        await UpdateLogOutTime();
        logOut();
    });

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <SnackbarProvider
                    action={(key) => (
                        <Button
                            onClick={() => closeSnackbar(key)}
                            style={{
                                height: '100%',
                                left: 0,
                                position: 'absolute',
                                top: 0,
                                width: '100%',
                            }}
                        />
                    )}
                    transitionDuration={{ enter: 200, exit: 200 }}
                    disableWindowBlurListener={true}
                    autoHideDuration={3000}
                    anchorOrigin={{
                        vertical: isMobile ? 'top' : 'bottom',
                        horizontal: isMobile ? 'center' : 'right',
                    }}
                    maxSnack={3}
                    Components={{
                        success: StyledMaterialDesignContent,
                        info: StyledMaterialDesignContent,
                        error: StyledMaterialDesignContent,
                    }}
                    iconVariant={{
                        success: (
                            <CheckCircleOutlineRoundedIcon
                                sx={{ mr: '10px', color: '#388e3c' }}
                            />
                        ),
                        info: (
                            <InfoOutlinedIcon
                                sx={{ mr: '10px', color: '#0288d1' }}
                            />
                        ),
                        error: (
                            <ErrorOutlineOutlinedIcon
                                sx={{ mr: '10px', color: 'rgba(211, 47, 47)' }}
                            />
                        ),
                    }}
                >
                    {' '}
                    <NavBar isLoggedIn={isLoggedIn} />
                    <Routes>
                        <Route path='/' element={<Auth />} />
                        <Route path='/dashboard' element={<NewInputPage />} />
                        <Route path='profile' element={<Profile />} />

                        <Route path='/set-username' element={<SetUsername />} />
                        <Route path='/set-password' element={<SetPassword />} />
                        <Route
                            path='/forgot-password'
                            element={<ForgotPassword />}
                        />
                        {/*  <Route
                                path='/privacypolicy'
                                element={<PrivacyPolicy />}
                            /> */}

                        <Route path='*' element={<FourOFourPage />} />
                    </Routes>
                </SnackbarProvider>
            </motion.div>{' '}
        </>
    );
}

function NavBar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    function usernameNotFound() {
        getUserDetails().then((r) => {
            setUserEmail(r.email);
        });
        enqueueSnackbar('Username not found', {
            variant: 'error',
            preventDuplicate: true,
        });
        navigate('/set-username');
    }
    async function fetchUsername() {
        let username;

        await getUsername().then((r) => {
            r != null ? (username = r) : usernameNotFound();
        });
        setUsername(username ? username : '');
    }
    useEffect(() => {
        checkIfSignedIn().then((r) => {
            if (r == true) {
                fetchUsername();
            } else {
                if (username != '') {
                    setUsername('');
                }
            }
        });
    }, [location.pathname]);

    return (
        <>
            <AppBar
                elevation={0}
                sx={{
                    position: location.pathname == '/dashboard' && 'relative',
                    backgroundColor: 'white',
                    paddingTop: 1.75,
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 0.95 }}
                        whileTap={{ scale: 0.8 }}
                    >
                        <IconButton
                            sx={{ borderRadius: '5px' }}
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            <Badge
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                color='primary'
                                badgeContent={'Beta'}
                            >
                                <Avatar
                                    sx={{
                                        borderRadius: 0,
                                        width: '50px',
                                        height: '50px',
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {' '}
                                </Avatar>
                            </Badge>
                        </IconButton>{' '}
                    </motion.div>

                    {(username || userEmail) && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: '0px 10px',
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                <Typography
                                    sx={{
                                        color: 'primary.main',
                                    }}
                                >
                                    {username != '' ? username : userEmail}
                                </Typography>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 0.95 }}
                                whileTap={{ scale: 0.8 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    navigate('/profile');
                                }}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: 'primary.main',
                                    }}
                                />
                            </motion.div>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
}
