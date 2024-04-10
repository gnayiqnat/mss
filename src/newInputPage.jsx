import { AddRounded, CloseRounded, LogoutRounded } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import { motion, useAnimate } from 'framer-motion';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import InputSection from './inputSection';
import {
    UpdateLogOutTime,
    calculateSessionStatus,
    checkIfSignedIn,
    getGrades,
    getStudentDetails,
} from './supabaseClient';
import { useMediaQuery } from 'react-responsive';
import { enqueueSnackbar } from 'notistack';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function NewInputPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [studentDetailsList, setStudentDetailsList] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 600px) ' });
    const isMobile500 = useMediaQuery({ query: '(max-width: 500px) ' });

    const [scope, animate] = useAnimate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
    };
    useEffect(() => {
        if (studentDetailsList == '') {
            setTimeout(() => {
                fetchStudents();
            }, 750);
        }
        if (buttonClicked) {
            animate(scope.current, { rotateZ: 0 }, { duration: 0.001 }).then(
                () => {
                    animate(
                        scope.current,
                        { rotateZ: buttonClicked ? -360 : 0 },
                        { duration: 1 },
                        { ease: 'linear' }
                    );
                }
            );

            fetchStudents();
            setButtonClicked(false);
        }
    }, [buttonClicked]);

    async function fetchStudents() {
        await getStudentDetails().then((r) => setStudentDetailsList(r));

        if (studentDetailsList.length === 7) {
            setDrawerOpen(false);
        }
    }

    async function handleXClick(e) {
        if (e) {
            await UpdateLogOutTime(e);
        }
        setButtonClicked(true);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <GlobalContext.Provider value={setButtonClicked}>
                <AddStudentDrawer
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                />
            </GlobalContext.Provider>
            <Box
                sx={{
                    mt: isMobile ? 7 : 5,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '99vw',
                    gap: '25px',
                    paddingBottom: '70px',
                }}
            >
                <Box
                    sx={{
                        width: '90vw',
                        maxWidth: '700px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        align: 'center',
                        mb: 3,
                        ml: 2,
                        margin: '0 auto',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: 'Nunito',
                            fontSize: isMobile ? '1.4rem' : '1.5rem',
                            mt: isMobile && 0.5,
                        }}
                    >
                        Pupils ({studentDetailsList.length})
                    </Typography>
                    {studentDetailsList != null && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '0px 10px',
                            }}
                        >
                            <Box>
                                <motion.div
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 0.95 }}
                                    whileTap={{ scale: 0.8 }}
                                >
                                    {isMobile500 ? (
                                        <>
                                            <IconButton
                                                onClick={() => {
                                                    setButtonClicked(true);
                                                }}
                                            >
                                                <CachedTwoToneIcon
                                                    ref={scope}
                                                    sx={{
                                                        color: 'primary.main',
                                                    }}
                                                />{' '}
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Button
                                            disableRipple
                                            variant='outlined'
                                            sx={{
                                                borderRadius: '10px',
                                                borderColor: 'primary.main',
                                                borderWidth: '1.5px',
                                                padding: '8px 20px',
                                                paddingLeft: '15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0px 5px',

                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    borderWidth: '1.5px',
                                                },
                                            }}
                                            onClick={() => {
                                                setButtonClicked(true);
                                            }}
                                        >
                                            <CachedTwoToneIcon
                                                ref={scope}
                                                fontSize='small'
                                                sx={{ color: 'primary.main' }}
                                            />
                                            <Typography
                                                sx={{
                                                    color: 'primary.main',
                                                    mt: 0.17,
                                                    textTransform: 'none',
                                                    fontSize: '0.9rem',

                                                    fontFamily: 'Nunito',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                Refresh
                                            </Typography>
                                        </Button>
                                    )}
                                </motion.div>{' '}
                            </Box>
                            {studentDetailsList.length < 8 && (
                                <motion.div
                                    initial={{ scale: 1, x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    whileHover={{ scale: 0.95 }}
                                    whileTap={{ scale: 0.8 }}
                                >
                                    {isMobile500 ? (
                                        <>
                                            <IconButton
                                                onClick={() => {
                                                    setDrawerOpen(true);
                                                }}
                                            >
                                                <AddRounded
                                                    sx={{
                                                        color: 'primary.main',
                                                    }}
                                                />{' '}
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Button
                                            disableRipple
                                            variant='outlined'
                                            sx={{
                                                borderRadius: '10px',
                                                padding: '8px 20px',
                                                paddingLeft: '15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0px 5px',

                                                backgroundColor: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'primary.main',
                                                },
                                            }}
                                            onClick={() => {
                                                setDrawerOpen(true);
                                            }}
                                        >
                                            <AddRounded
                                                fontSize='small'
                                                sx={{
                                                    color: 'secondary.main',
                                                }}
                                            />{' '}
                                            <Typography
                                                sx={{
                                                    color: 'secondary.main',
                                                    mt: 0.17,
                                                    textTransform: 'none',
                                                    fontSize: '0.9rem',

                                                    fontFamily: 'Nunito',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                Add Pupil
                                            </Typography>
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </Box>
                    )}
                </Box>
                <Box sx={{ width: '95vw', ml: -6 }}>
                    {studentDetailsList != '' ? (
                        <motion.ul
                            variants={container}
                            initial='hidden'
                            animate='show'
                            style={{
                                maxWidth: '750px',
                                margin: '0 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px 0px',
                                listStyleType: 'none',
                            }}
                        >
                            {studentDetailsList.map((e, i) => (
                                <motion.li variants={item} key={i}>
                                    <Card
                                        variant='outlined'
                                        sx={{
                                            padding: isMobile
                                                ? '13px 20px'
                                                : '13px 30px',
                                            color: 'primary.main',

                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '26px 15px',
                                            borderRadius: '15px',
                                            maxWidth: '800px',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'primary.main',
                                                fontFamily: 'Nunito',
                                                fontWeight: '700',
                                                fontSize: '1.1rem',
                                                maxWidth: isMobile
                                                    ? '45vw'
                                                    : '200px',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {e.student_name}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection:
                                                    e.student_name.length > 10
                                                        ? 'column'
                                                        : 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '8px 13px',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    backgroundColor:
                                                        'secondary.main',
                                                    color: 'primary.main',
                                                    fontFamily: 'Nunito',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700',
                                                    padding: '5px 13px',
                                                    borderRadius: '30px',
                                                    whiteSpace: 'nowrap',
                                                    maxHeight: '20px',
                                                }}
                                            >
                                                {e.student_class}
                                            </Box>
                                            {isMobile && (
                                                <Card
                                                    variant='outlined'
                                                    sx={{
                                                        backgroundColor:
                                                            'transparent',
                                                        color: 'primary.main',
                                                        borderColor:
                                                            'primary.main',
                                                        fontFamily: 'Nunito',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '700',
                                                        padding: '5px 13px',
                                                        borderRadius: '30px',
                                                        whiteSpace: 'nowrap',
                                                        maxHeight: '20px',
                                                    }}
                                                >
                                                    {calculateSessionStatus(
                                                        e.sign_in_time,
                                                        true
                                                    )}
                                                </Card>
                                            )}
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'end',
                                                alignItems: 'center',
                                                gap: '0px 20px',
                                            }}
                                        >
                                            {!isMobile && (
                                                <>
                                                    <Typography
                                                        sx={{
                                                            color: 'primary.main',
                                                            opacity: 0.5,
                                                            fontFamily:
                                                                'Nunito',
                                                            fontWeight: '600',
                                                            fontSize: '1rem',
                                                            whiteSpace:
                                                                'nowrap',
                                                        }}
                                                    >
                                                        {calculateSessionStatus(
                                                            e.sign_in_time
                                                        )}
                                                    </Typography>
                                                </>
                                            )}
                                            {isMobile ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleXClick(
                                                            e.id
                                                                ? e.id
                                                                : enqueueSnackbar(
                                                                      'No row ID. Please contact your organization.',
                                                                      {
                                                                          variant:
                                                                              'error',
                                                                      }
                                                                  )
                                                        )
                                                    }
                                                >
                                                    <LogoutRounded
                                                        sx={{
                                                            color: '#d32f2f',
                                                        }}
                                                    />
                                                </IconButton>
                                            ) : (
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
                                                            borderRadius:
                                                                '10px',
                                                            borderColor:
                                                                '#d32f2f',
                                                            backgroundColor:
                                                                '#d32f2f40',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#d32f2f40',
                                                                borderColor:
                                                                    '#d32f2f',
                                                                opacity: 0.7,
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            handleXClick(
                                                                e.id
                                                                    ? e.id
                                                                    : enqueueSnackbar(
                                                                          'No row ID. Please contact your organization.',
                                                                          {
                                                                              variant:
                                                                                  'error',
                                                                          }
                                                                      )
                                                            )
                                                        }
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: '#d32f2f',
                                                                textTransform:
                                                                    'none',
                                                                whiteSpace:
                                                                    'nowrap',
                                                            }}
                                                        >
                                                            End Session
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    </Card>
                                </motion.li>
                            ))}
                        </motion.ul>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 10,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: 'primary.main',
                                    fontFamily: 'Nunito',
                                    fontWeight: '500',
                                    fontSize: '1.2rem',
                                    opacity: 0.5,
                                }}
                            >
                                No active sessions
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </motion.div>
    );
}

function AddStudentDrawer({ drawerOpen, setDrawerOpen }) {
    const [grades, setGrades] = useState('');

    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    useEffect(() => {
        checkIfSignedIn().then((r) => {
            if (r != true) {
                navigate('/');
            } else {
                if (grades == '') {
                    getGrades().then((r) => {
                        setGrades(r);
                    });
                }
            }
        });
    }, []);

    return (
        <>
            <Drawer
                anchor='right'
                sx={{
                    padding: '0px 30px',
                }}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{
                        mt: 5,
                        padding: isMobile ? '30px 0px' : '80px 0px',
                        width: '100vw',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            padding: isMobile ? '10px' : '20px',
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                setDrawerOpen(false);
                            }}
                        >
                            <CloseRounded
                                fontSize='large'
                                sx={{ color: 'primary.main' }}
                            />
                        </IconButton>
                        {/* <Button
                            onClick={() => {
                                setDrawerOpen(false);
                            }}
                            variant='outlined'
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                borderColor: 'primary.main',
                                borderWidth: '2px',
                            }}
                        >
                            <CloseRounded sx={{ color: 'primary.main' }} />
                            <Typography
                                sx={{
                                    textTransform: 'none',
                                    fontFamily: 'Nunito',
                                    fontWeight: '600',
                                    fontSize: '1.2rem',
                                }}
                            >
                                CLOSE
                            </Typography>
                        </Button> */}
                    </Box>
                    {grades ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                align='center'
                                sx={{
                                    fontFamily: 'Nunito',
                                    fontWeight: '600',
                                    fontSize: '1.5rem',
                                    mb: 7,
                                    mt: isMobile && 7,
                                }}
                            >
                                Add new student
                            </Typography>
                            <InputSection
                                setDrawerOpen={setDrawerOpen}
                                grades={grades}
                                setGrades={setGrades}
                            />
                        </Box>
                    ) : (
                        <Typography>
                            Error - Grades could not be fetched. Please contact
                            your organization for more info
                        </Typography>
                    )}
                </Box>
            </Drawer>
        </>
    );
}
