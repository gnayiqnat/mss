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

export default function InputSection() {
    const navigate = useNavigate();

    const [isSessionRunning, setIsSessionRunning] = useState(false);

    const grades = ['Form 1', 'Form 2', 'Form 3'];

    const studentName = useRef('');

    const [selectedClass, setSelectedClass] = useState(''); // State to store the currently selected value
    const studentClassRef = useRef(selectedClass); // Ref synchronized with state

    const handleSelectChange = (event) => {
        const newClass = event.target.value;
        setSelectedClass(newClass);
        studentClassRef.current = newClass;
    };

    async function handleSuccess() {
        setIsSessionRunning(true);
        
        studentName.current = ''
        studentName.current == '' && setSelectedClass('')
    }

    function handleSubmit() {
        if (studentName.current && studentClassRef.current) {
            LogSignInTime(studentName.current, studentClassRef.current).then(
                (r) => {
                    r
                        ? enqueueSnackbar(r, {
                              variant: 'error',
                              preventDuplicate: true,
                          })
                        : handleSuccess();
                }
            );
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
                        alignItems: 'center',
                        gap: '0px 13px',
                    }}
                >
                    <TextField
                        onKeyDown={(e) => {
                            e.key === 'Enter' && handleSubmit();
                        }}
                        onChange={(e) => {
                            studentName.current = e.target.value;
                        }}
                        sx={{ width: '300px' }}
                        label='Student name'
                    ></TextField>
                    <TextField
                        value={selectedClass}
                        onChange={handleSelectChange}
                        sx={{ width: '100px' }}
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
            </Box>
        </>
    );
}

function SubmitButton({ handleSubmit }) {
    const setButtonClicked = useGlobalContext();
    return (
        <Button
            sx={{
                mt: 2,
                backgroundColor: 'primary.main',
                padding: '15px',
                width: '100%',
                maxWidth: '425px',
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
