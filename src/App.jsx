import 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Layout/AppNavbar';
import MainPage from './pages/MainPage';
import ReportPage from './pages/ReportPage';

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
