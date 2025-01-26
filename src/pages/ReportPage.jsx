/**
 * @file ReportPage.jsx
 * Displays a table + pie chart for either:
 *   - A single month/year, or
 *   - An entire year (if "All Year?" is checked).
 *
 * Automatically loads data for the current month/year on mount.
 */

import  { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
    getCostsForMonth,
    getCostsForYear,
    deleteCost,
} from '../idb/idbModule';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MONTHS = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];

// Some arbitrary colors for the pie slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE', '#5CABFA'];

/**
 * Helper to convert a list of cost items into category totals for the pie chart.
 * Each item -> { category: string, sum: number }
 * We aggregate by category: { [categoryName]: totalSum }
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
    // Convert the map to an array that Recharts can use
    return Object.keys(totalsMap).map((cat) => ({
        category: cat,
        total: totalsMap[cat],
    }));
}

function ReportPage() {
    const now = new Date();
    // We'll default to the current month (1-based)
    const defaultMonth = now.getMonth() + 1;
    // We'll store the year in a Date, so the year DatePicker works
    const defaultYearDate = new Date(now.getFullYear(), 0, 1);

    // State for controlling year + month
    const [yearDate, setYearDate] = useState(defaultYearDate);
    const [month, setMonth] = useState(`${defaultMonth}`);

    // Checkbox for entire year
    const [allYear, setAllYear] = useState(false);

    // The fetched cost items (entire year or single month)
    const [costs, setCosts] = useState([]);

    // For limiting selection to the current year or earlier
    const currentYear = now.getFullYear();
    const maxYearDate = new Date(currentYear, 11, 31);

    // Whenever "costs" changes, compute category totals for the pie chart
    const chartData = useMemo(() => computeCategoryTotals(costs), [costs]);

    /**
     * Fetch data based on "allYear" toggle.
     * - If allYear = true, call getCostsForYear(yearNum).
     * - Else, call getCostsForMonth(monthNum, yearNum).
     */
    const fetchReportData = async () => {
        if (!yearDate) {
            console.warn('No year selected.');
            return;
        }
        const yearNum = yearDate.getFullYear();

        try {
            let data;
            if (allYear) {
                // Entire year
                data = await getCostsForYear(yearNum);
            } else {
                // Single month
                if (!month) {
                    console.warn('No month selected.');
                    return;
                }
                const monthNum = parseInt(month, 10);
                data = await getCostsForMonth(monthNum, yearNum);
            }
            setCosts(data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // Automatically load the current month/year on mount
    useEffect(() => {
        fetchReportData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If user changes "allYear", "month", or "yearDate," they can click "Get Report" to re-fetch
    const handleGetReport = () => {
        fetchReportData();
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            await deleteCost(id);
            // Re-fetch so table & chart update
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

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {/* Month Select (disabled if allYear is true) */}
                <FormControl sx={{ minWidth: 120 }} disabled={allYear}>
                    <InputLabel id="month-label">Month</InputLabel>
                    <Select
                        labelId="month-label"
                        label="Month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        {MONTHS.map((m) => (
                            <MenuItem key={m.value} value={m.value}>
                                {m.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Year Picker (views={['year']}) */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        views={['year']}
                        label="Select Year"
                        value={yearDate}
                        onChange={(newValue) => setYearDate(newValue)}
                        maxDate={maxYearDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                {/* Checkbox for entire year */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allYear}
                            onChange={(e) => setAllYear(e.target.checked)}
                        />
                    }
                    label="All Year?"
                />

                <Button variant="contained" onClick={handleGetReport}>
                    Get Report
                </Button>
            </Box>

            {/* TABLE OF ITEMS */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sum</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Actions</TableCell> {/* new column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {costs.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>${item.sum}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* PIE CHART (Category Totals) */}
            <Typography variant="h5" gutterBottom>
                Category Totals
            </Typography>
            {chartData.length > 0 ? (
                <PieChart width={400} height={300}>
                    <Pie
                        data={chartData}
                        dataKey="total"
                        nameKey="category"
                        outerRadius={100}
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={entry.category}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            ) : (
                <Typography>No data to display.</Typography>
            )}
        </Box>
    );
}

export default ReportPage;
