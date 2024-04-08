import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100dvh',
                flexDirection: 'column',
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <img
                    style={{ height: '300px', width: '300px' }}
                    src='https://sdrjkixaigybtdpadjmi.supabase.co/storage/v1/object/public/images/laugh-point.gif'
                />
            </motion.div>
        </div>
    );
}
