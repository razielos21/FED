// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // default MUI blue
        },
        secondary: {
            main: '#9c27b0', // MUI purple
        },
    },
    typography: {
        // Example customizations
        fontFamily: 'Roboto, Arial',
        h5: {
            fontWeight: 600,
        },
    },
});

export default theme;
