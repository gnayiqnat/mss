import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {
    Box,
    Button,
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
    getStudentDetails,
} from './supabaseClient';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from './newInputPage';
import { useMediaQuery } from 'react-responsive';

export default function InputSection({ setDrawerOpen }) {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [isSessionRunning, setIsSessionRunning] = useState(false);

    const grades = ['Form 1', 'Form 2', 'Form 3'];

    const [studentName, setStudentName] = useState('');

    const [selectedClass, setSelectedClass] = useState(''); // State to store the currently selected value
    const studentClassRef = useRef(selectedClass); // Ref synchronized with state

    const handleSelectChange = (event) => {
        const newClass = event.target.value;
        setSelectedClass(newClass);
        studentClassRef.current = newClass;
    };

    async function handleSuccess() {
        setIsSessionRunning(true);
        enqueueSnackbar('Student added', {variant: 'success'})

        setStudentName('');
        setSelectedClass('');
    }

    function handleSubmit() {
        if (studentName && studentClassRef.current) {
            LogSignInTime(studentName, studentClassRef.current).then((r) => {
                r
                    ? enqueueSnackbar(r, {
                          variant: 'error',
                          preventDuplicate: true,
                      })
                    : handleSuccess();
            });
        } else {
            enqueueSnackbar('Fields must not be empty', {
                variant: 'error',
                preventDuplicate: true,
            });
        }

        getStudentDetails();
    }

    useEffect(() => {
        checkIfSignedIn().then((r) => {
            if (r != true) {
                navigate('/');
            }
        });
    }, [isSessionRunning]);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: isMobile && 'column',
                        alignItems: 'center',
                        gap: '20px 13px',
                    }}
                >
                    <TextField
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
                        value={selectedClass}
                        onChange={handleSelectChange}
                        sx={{ width: isMobile ? '90vw' : '100px' }}
                        select
                        label='Grade'
                    >
                        {grades.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <SubmitButton handleSubmit={handleSubmit} />
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
function SubmitButton({ handleSubmit }) {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const setButtonClicked = useGlobalContext();
    return (
        <Button
            sx={{
                position: isMobile && 'absolute',
                bottom: isMobile && '10px',
                mt: 2,
                mb: 0.5,
                backgroundColor: 'primary.main',
                padding: '15px',
                width: '425px',
                maxWidth: '93vw',

                borderRadius: '20px',
                '&:hover': {
                    backgroundColor: 'primary.main',
                },
            }}
            onClick={() => {
                handleSubmit();
                setButtonClicked(true);
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
    );
}
