import { AddRounded, CloseRounded } from '@mui/icons-material';
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
import { motion } from 'framer-motion';
import { createContext, useContext, useEffect, useState } from 'react';
import InputSection from './inputSection';
import { UpdateLogOutTime, getStudentDetails } from './supabaseClient';
import { useMediaQuery } from 'react-responsive';
import { enqueueSnackbar } from 'notistack';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function NewInputPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [studentDetailsList, setStudentDetailsList] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        if (studentDetailsList == '') {
            fetchStudents();
        }
        if (buttonClicked) {
            fetchStudents();
            setButtonClicked(false);
        }
    }, [buttonClicked]);

    function fetchStudents() {
        getStudentDetails().then((r) => setStudentDetailsList(r));
    }

    async function handleXClick(e) {
        if (e) {
            await UpdateLogOutTime(e);
        }
        setButtonClicked(true);
    }

    return (
        <>
            <GlobalContext.Provider value={setButtonClicked}>
                <AddStudentDrawer
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                />
            </GlobalContext.Provider>
            <Box
                sx={{
                    mt: 5,
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '96vw',
                    height: '80dvh',
                }}
            >
                <Box
                    sx={{
                        margin: '0 auto',
                        maxWidth: '700px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '10px 0px',
                        mb: 4,
                    }}
                >
                    <Typography
                        sx={{ ml: 2, fontFamily: 'Nunito', fontSize: '1.5rem' }}
                    >
                        Pupils ({studentDetailsList.length})
                    </Typography>
                    {studentDetailsList != null &&
                        studentDetailsList.length < 8 && (
                            <Box
                                sx={{
                                    mt: -1,
                                }}
                            >
                                <Button
                                    variant='outlined'
                                    sx={{
                                        borderRadius: '10px',
                                        padding: '8px 20px',
                                        paddingLeft: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0px 5px',
                                        mr: 2,

                                        backgroundColor: 'primary.main',
                                    }}
                                    onClick={() => {
                                        setDrawerOpen(true);
                                    }}
                                >
                                    <AddRounded
                                        fontSize='small'
                                        sx={{ color: 'secondary.main' }}
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
                            </Box>
                        )}
                </Box>
                <Box
                    sx={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px 0px',
                    }}
                >
                    {studentDetailsList &&
                        studentDetailsList.map((e, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    maxWidth: '700px',
                                }}
                            >
                                <Card
                                    variant='outlined'
                                    sx={{
                                        padding: '13px 30px',
                                        color: 'primary.main',

                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: '0px 15px',
                                        borderRadius: '15px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: '13px',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'primary.main',
                                                fontFamily: 'Nunito',
                                                fontWeight: '700',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            {e.student_name}
                                        </Typography>
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
                                            }}
                                        >
                                            {e.student_class}
                                        </Box>
                                    </Box>

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
                                                    textTransform: 'none',
                                                }}
                                            >
                                                End Session
                                            </Typography>
                                        </Button>
                                    </Box>
                                </Card>
                            </motion.div>
                        ))}
                </Box>
            </Box>
        </>
    );
}

function AddStudentDrawer({ drawerOpen, setDrawerOpen }) {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
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
                        padding: isMobile ? '30px 0px' : '80px 50px',
                        width: '100vw',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            left: '105px',
                            padding: '20px',
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
                    <Typography
                        align='center'
                        sx={{
                            fontFamily: 'Nunito',
                            fontWeight: '600',
                            fontSize: '1.5rem',
                            mb: 7,
                        }}
                    >
                        Add new student
                    </Typography>
                    <InputSection setDrawerOpen={setDrawerOpen} />
                </Box>
            </Drawer>
        </>
    );
}
