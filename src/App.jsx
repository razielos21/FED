/**
 * @file App.jsx
 * @description Main component of the application
 * @module App
 * @see module:App
 * @requires react
 * @requires react-router-dom
 * @requires ./components/Layout/AppNavbar
 * @requires ./pages/MainPage
 * @requires ./pages/ReportPage
 * @exports App
 * @version 0.1.0
 *
 * @createdBy Yotam Haimovitch & Raziel Otick
 *
 */

// Importing components
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import AppNavbar from './components/Layout/AppNavbar';
import MainPage from './pages/MainPage';
import ReportPage from './pages/ReportPage';
import './styles.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Router>
                <AppNavbar toggleTheme={toggleTheme} />
                <Routes>
                    <Route path="/FED/" element={<MainPage />} />
                    <Route path="/FED/report" element={<ReportPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;