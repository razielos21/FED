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
import 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Layout/AppNavbar';
import MainPage from './pages/MainPage';
import ReportPage from './pages/ReportPage';

/**
 * Main component of the application
 * @returns {JSX.Element} - Application
 * @constructor
 */
function App() {
    return (
        <Router>
            <AppNavbar />

            <Routes>
                <Route path="/FED/" element={<MainPage />} />
                <Route path="/FED/report" element={<ReportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
