/**
 * @file ReportPage.jsx
 * Displays a table + pie chart for either:
 *   - A single month/year
 *   - An entire year (if "All Year?" is checked).
 *
 * Automatically loads data for the current month/year on mount.
 */

import  { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { getCostsForMonth, getCostsForYear, deleteCost } from '../idb/idbModule';

import MonthYearControls from '../components/MonthYearControls';
import CostsTable from '../components/CostsTable';
import CategoryPieChart from '../components/CategoryPieChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE', '#5CABFA'];

/**
 * Convert list of cost items into category totals for the pie chart.
 * item -> { category: string, sum: number }
 * grouped by category.
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

function ReportPage() {
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
        fetchReportData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refresh data when "Get Report" is clicked
    const handleGetReport = () => {
        fetchReportData();
    };

    // Handle item deletion, then re-fetch
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            await deleteCost(id);
            fetchReportData();
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
            <CategoryPieChart chartData={chartData} colors={COLORS} />
        </Box>
    );
}

export default ReportPage;
