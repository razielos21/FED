/**
 * @file MonthlyReport.jsx
 * Displays a table of costs for a chosen month/year.
 * - Month is chosen via <Select>.
 * - Year is chosen via a <DatePicker> restricted to the current year or earlier.
 */

import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getCostsForMonth } from '../idb/idbModule'; // Adjust to your actual path

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

function MonthlyReport() {
    // State for month, year, and fetched data
    const [month, setMonth] = useState('');
    const [yearDate, setYearDate] = useState(null);
    const [costs, setCosts] = useState([]);

    // Limit year selection up to the current year
    const currentYear = new Date().getFullYear();
    const maxYearDate = new Date(currentYear, 11, 31);

    const handleFetch = async () => {
        if (!month || !yearDate) {
            alert('Please select a month and a valid year!');
            return;
        }

        try {
            const monthNum = parseInt(month, 10);
            const yearNum = yearDate.getFullYear(); // from the Date object
            const data = await getCostsForMonth(monthNum, yearNum);
            setCosts(data);
        } catch (error) {
            console.error('Error fetching costs:', error);
            alert('Failed to fetch costs. Check the console for details.');
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Monthly Report
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {/* Month Select */}
                <FormControl sx={{ minWidth: 120 }}>
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

                <Button variant="contained" onClick={handleFetch}>
                    Get Report
                </Button>
            </Box>

            {/* Display results in a Material UI Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sum</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {costs.map((cost) => (
                            <TableRow key={cost.id}>
                                <TableCell>{cost.date}</TableCell>
                                <TableCell>{cost.category}</TableCell>
                                <TableCell>${cost.sum}</TableCell>
                                <TableCell>{cost.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MonthlyReport;
