/**
 * @file PieChartView.jsx
 * Displays a pie chart of total costs per category for either:
 *  - a specific month/year, or
 *  - an entire year (if "All Year?" is checked)
 *
 * Uses a year-only DatePicker (limited to current year or earlier).
 */

import  { useState } from 'react';
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
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    getCategoryTotalsForMonth,
    getCategoryTotalsForYear,
} from '../idb/idbModule'; // Adjust import paths as needed

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

// Colors for pie slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE', '#5CABFA'];

function PieChartView() {
    // month is picked via <Select> (disabled if "All Year?" is checked)
    const [month, setMonth] = useState('');
    // year is chosen via year-only DatePicker
    const [yearDate, setYearDate] = useState(null);
    // "All Year?" checkbox
    const [allYear, setAllYear] = useState(false);
    // Data for the chart
    const [chartData, setChartData] = useState([]);

    // Limit year selection up to the current year
    const currentYear = new Date().getFullYear();
    const maxYearDate = new Date(currentYear, 11, 31);

    const handleFetchChart = async () => {
        if (!yearDate) {
            alert('Please select a year!');
            return;
        }
        // If allYear is false, ensure month is selected
        if (!allYear && !month) {
            alert('Please select a month or enable "All Year?"');
            return;
        }

        try {
            const yearNum = yearDate.getFullYear();

            let data;
            if (allYear) {
                // Entire year
                data = await getCategoryTotalsForYear(yearNum);
            } else {
                // Specific month
                const monthNum = parseInt(month, 10);
                data = await getCategoryTotalsForMonth(monthNum, yearNum);
            }

            setChartData(data);
        } catch (error) {
            console.error('Error fetching category totals:', error);
            alert('Failed to fetch category totals. See console for details.');
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
                Pie Chart (Costs per Category)
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {/* Month Select (disabled if All Year is checked) */}
                <FormControl
                    sx={{ minWidth: 120 }}
                    disabled={allYear}
                >
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

                {/* Year Picker */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        views={['year']}
                        label="Select Year"
                        value={yearDate}
                        onChange={(newValue) => setYearDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={maxYearDate}
                    />
                </LocalizationProvider>

                {/* Checkbox: "All Year?" */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allYear}
                            onChange={(e) => {
                                setAllYear(e.target.checked);
                            }}
                        />
                    }
                    label="All Year?"
                />

                <Button variant="contained" onClick={handleFetchChart}>
                    Get Pie Chart
                </Button>
            </Box>

            {/* Render the chart if data is present */}
            {chartData.length > 0 && (
                <PieChart width={400} height={300}>
                    <Pie
                        data={chartData}
                        dataKey="total"
                        nameKey="category"
                        outerRadius={100}
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            )}
        </Box>
    );
}

export default PieChartView;
