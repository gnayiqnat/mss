import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

export default function FourOFourPage() {
    const isMobile = useMediaQuery({ query: '(max-width: 960px)' });
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        display: 'flex',
                        height: '100dvh',

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Typography
                            variant={isMobile ? 'h2' : 'h1'}
                            align='center'
                            sx={{
                                fontFamily: 'Nunito',
                                fontWeight: '500',
                                color: 'primary.main',
                                opacity: 0.9,
                            }}
                        >
                            404
                        </Typography>
                        <Typography
                            align='center'
                            sx={{
                                fontFamily: 'Nunito',
                                fontWeight: '600',
                                fontSize: isMobile ? '1.2rem' : '1.5rem',
                                opacity: 0.8,
                            }}
                        >
                            Are you sure you have typed the correct url?
                        </Typography>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}
