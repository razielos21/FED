import 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Layout/AppNavbar';
import MainPage from './pages/MainPage';
import ReportPage from './pages/ReportPage';

function App() {
    return (
        <Router>
            {/* Use your existing NavBar component */}
            <AppNavbar />

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/report" element={<ReportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
