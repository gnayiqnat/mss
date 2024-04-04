import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: { primary: { main: '#232932' }, secondary: { main: '#aeb8c6' } },
});
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
