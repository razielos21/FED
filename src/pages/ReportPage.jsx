/**
 * @file ReportPage.jsx
 * Displays a table + pie chart for either:
 *   - A single month/year
 *   - An entire year (if "All Year?" is checked).
 *
 * Automatically loads data for the current month/year on mount.
 * Allows user to select a different month/year and refresh the data.
 * Allows user to delete cost items.
 * Uses Material-UI components: Box, Typography.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 *  ReportPage: React component
 *
 * Example usage:
 *  import ReportPage from './ReportPage.jsx';
 *  ReactDOM.render(<ReportPage />, document.getElementById('root'));
 *
 */

// Import necessary modules
import  { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { getCostsForMonth, getCostsForYear, deleteCost } from '../idb/idbModule';

import MonthYearControls from '../components/MonthYearControls';
import CostsTable from '../components/CostsTable';
import CategoryPieChart from '../components/CategoryPieChart';

/**
 * Compute category totals from an array of cost items.
 * @param costs - Array of cost items with properties: category, sum
 * @returns {{category: *, total: *}[]}
 */
function computeCategoryTotals(costs) {
    const totalsMap = {};
    costs.forEach((item) => {
        const cat = item.category || 'Uncategorized';
        if (!totalsMap[cat]) {
            totalsMap[cat] = 0;
        }
        totalsMap[cat] += item.sum;
    });
    return Object.keys(totalsMap).map((cat) => ({
        category: cat,
        total: totalsMap[cat],
    }));
}

/**
 * Displays a table + pie chart for either:
 * @returns {JSX.Element} - The report page content
 * @constructor
 */
function ReportPage() {
    // Get current month/year
    const now = new Date();
    const defaultMonth = now.getMonth() + 1; // 1-based
    const defaultYearDate = new Date(now.getFullYear(), 0, 1);

    // State
    const [month, setMonth] = useState(`${defaultMonth}`);
    const [yearDate, setYearDate] = useState(defaultYearDate);
    const [allYear, setAllYear] = useState(false);
    const [costs, setCosts] = useState([]);

    // Limit year selection to current year or earlier
    const currentYear = now.getFullYear();
    const maxYearDate = new Date(currentYear, 11, 31);

    // Compute chart data each time costs changes
    const chartData = useMemo(() => computeCategoryTotals(costs), [costs]);

    /**
     * Fetch data from IDB based on month/year or entire year.
     */
    const fetchReportData = async () => {
        if (!yearDate) return;
        const yearNum = yearDate.getFullYear();

        try {
            let data;
            if (allYear) {
                data = await getCostsForYear(yearNum);
            } else {
                const monthNum = parseInt(month, 10);
                if (!monthNum) return;
                data = await getCostsForMonth(monthNum, yearNum);
            }
            setCosts(data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // Automatically load current month/year on mount
    useEffect(() => {
        fetchReportData().then(() => console.log('Fetched report data'));
    });

    // Refresh data when "Get Report" is clicked
    const handleGetReport = () => {
        fetchReportData().then(() => console.log('Fetched report data'));
    };

    // Handle item deletion, then re-fetch
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            await deleteCost(id);
            await fetchReportData();
        } catch (err) {
            console.error('Error deleting cost:', err);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Report
            </Typography>

            <MonthYearControls
                month={month}
                onMonthChange={setMonth}
                yearDate={yearDate}
                onYearChange={setYearDate}
                maxYearDate={maxYearDate}
                allYear={allYear}
                onAllYearChange={setAllYear}
                onGetReport={handleGetReport}
            />

            <CostsTable costs={costs} onDelete={handleDelete} />

            <Typography variant="h4" gutterBottom>
                Category Totals
            </Typography>
            <CategoryPieChart chartData={chartData}/>
        </Box>
    );
}

export default ReportPage;
