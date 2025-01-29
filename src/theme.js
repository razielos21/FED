/**
 * @file theme.js
 * This file provides the theme for the application.
 * It uses Material-UI components.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 * theme: Material-UI theme
 *
 * Example usage:
 * import { ThemeProvider } from '@mui/material/styles';
 * import theme from './theme';
 *
 * <ThemeProvider theme={theme}>
 *  // Your application here
 * </ThemeProvider>
 */

// Import necessary modules
import { createTheme } from '@mui/material/styles';

// Create the theme
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
