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
import 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';

function AppNavbar({ toggleTheme, isDarkMode }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cost Manager
                </Typography>
                <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode" }>
                <IconButton onClick={toggleTheme} color="inherit">
                   <DarkModeIcon fontSize="large"/>
                </IconButton>
                </Tooltip>
                <Tooltip title="Home">
                <IconButton color="inherit" component={Link} to="/FED/">
                    <HomeIcon fontSize="large"/>
                </IconButton>
                </Tooltip>
                <Tooltip title = "Report">
                <IconButton color="inherit" component={Link} to="/FED/report">
                    <AssessmentIcon fontSize="large"/>
                </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}

AppNavbar.propTypes = {
    toggleTheme: PropTypes.func.isRequired,
    isDarkMode: PropTypes.bool.isRequired,
};


export default AppNavbar;
