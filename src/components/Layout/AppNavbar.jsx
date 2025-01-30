/**
 * @file AppNavbar.jsx
 * This file provides a simple navigation bar for the application.
 * It uses the Material-UI AppBar, Toolbar, Typography, and Button components.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 *  AppNavbar: React component
 *
 * Example usage:
 *  import AppNavbar from './AppNavbar.jsx';
 *  ReactDOM.render(<AppNavbar />, document.getElementById('root'));
 */

// Import necessary modules
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import darkModeIcon from '../../assets/dark-mode.png';

function AppNavbar({ toggleTheme }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cost Manager
                </Typography>
                <IconButton onClick={toggleTheme} color="inherit">
                    <img src={darkModeIcon} alt="Dark Mode" style={{ width: 24, height: 24 }} />
                </IconButton>
                <Button color="inherit" component={Link} to="/FED/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/FED/report">
                    Report
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default AppNavbar;
