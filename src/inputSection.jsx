import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    MenuItem,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    CheckExistingSession,
    LogSignInTime,
    checkIfSignedIn,
    getGrades,
    getStudentDetails,
} from './supabaseClient';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from './newInputPage';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

export default function InputSection({ setDrawerOpen, grades, setGrades }) {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [studentName, setStudentName] = useState('');

    const [selectedClass, setSelectedClass] = useState(''); // State to store the currently selected value
    const studentClassRef = useRef(selectedClass); // Ref synchronized with state

    const [isLoading, setIsLoading] = useState(false);

    const handleSelectChange = (event) => {
        const newClass = event.target.value;
        setSelectedClass(newClass);
        studentClassRef.current = newClass;
    };

    async function handleSuccess() {
        enqueueSnackbar('Student added', {
            variant: 'success',
        });
        setStudentName('');
        setSelectedClass('');
        studentClassRef.current = '';

        setIsLoading(false);
    }

    function handleSubmit() {
        formRef.current.reportValidity();
        setIsLoading(true);
        if (studentName && studentClassRef.current) {
            LogSignInTime(studentName, studentClassRef.current).then((r) => {
                if (r) {
                    if (r == 'no username :(') {
                        enqueueSnackbar('Username not found', {
                            variant: 'error',
                            preventDuplicate: true,
                        });
                        navigate('/set-username');
                    }
                    console.log(r);
                } else {
                    handleSuccess();
                }
            });
        } else {
            setIsLoading(false);
        }

        getStudentDetails();
    }

    const formRef = useRef();
    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <form
                    ref={formRef}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        gap: '20px 13px',
                    }}
                >
                    <TextField
                        required
                        onKeyDown={(e) => {
                            e.key === 'Enter' && handleSubmit();
                        }}
                        value={studentName}
                        onChange={(e) => {
                            setStudentName(e.target.value);
                        }}
                        sx={{ width: isMobile ? '90vw' : '300px' }}
                        label='Student name'
                    ></TextField>
                    <TextField
                        required
                        value={selectedClass}
                        onChange={handleSelectChange}
                        sx={{ width: isMobile ? '90vw' : '130px' }}
                        select
                        label='Grade'
                        SelectProps={{
                            MenuProps: {
                                sx: { height: '300px' },
                            },
                        }}
                    >
                        {grades.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </form>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    formRef={formRef}
                />
                {/* {isMobile ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '10px',
                            display: 'grid',
                            gridTemplateRows: '1fr 1fr',
                        }}
                    >
                        <SubmitButton handleSubmit={handleSubmit} />
                        <CancelButton setDrawerOpen={setDrawerOpen} />
                    </Box>
                ) : (
                    <SubmitButton handleSubmit={handleSubmit} />
                )} */}
            </Box>
        </>
    );
}

function CancelButton({ setDrawerOpen }) {
    return (
        <>
            <Button
                variant='outlined'
                sx={{
                    mt: 1,
                    mb: 1,
                    backgroundColor: 'secondary.main',
                    padding: '14px',
                    width: '425px',
                    maxWidth: '95vw',

                    borderRadius: '20px',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                    },
                }}
                onClick={() => {
                    setDrawerOpen(false);
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'Nunito',
                        textTransform: 'none',
                        color: 'primary.main',
                        borderWidth: '2px',
                        fontWeight: '600',
                        fontSize: '18px',
                    }}
                >
                    Cancel
                </Typography>
            </Button>
        </>
    );
}
function SubmitButton({ handleSubmit, isLoading }) {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const setButtonClicked = useGlobalContext();
    return (
        <Box
            sx={{
                position: isMobile && 'absolute',
                bottom: isMobile && '10px',
                width: '98vw',
                justifyContent: 'center',
                display: 'flex',
            }}
        >
            <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.8 }}
            >
                <Button
                    type='submit'
                    sx={{
                        mt: 2,
                        mb: 0.5,
                        backgroundColor: 'primary.main',
                        padding: '15px',
                        width: '450px',
                        maxWidth: '93vw',

                        borderRadius: '15px',
                        '&:hover': {
                            backgroundColor: 'primary.main',
                        },
                    }}
                    onClick={() => {
                        handleSubmit();
                        setButtonClicked(true);
                    }}
                >
                    {isLoading ? (
                        <CircularProgress
                            disableShrink
                            size='1.69rem'
                            sx={{
                                color: 'hsl(216, 18%, 85%)',
                            }}
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
                </Button>
            </motion.div>
        </Box>
    );
}
