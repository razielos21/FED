import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Router basename="/FED-Project">
                <AppNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/report" element={<ReportPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;