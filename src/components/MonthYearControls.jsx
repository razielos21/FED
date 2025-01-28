import 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

/**
 * Props:
 * - month (string|number)
 * - onMonthChange(newMonth)
 * - yearDate (Date object)
 * - onYearChange(newDate)
 * - maxYearDate (Date) - limit year selection
 * - allYear (boolean)
 * - onAllYearChange(newValue)
 * - onGetReport() - callback when "Get Report" is clicked
 */
function MonthYearControls({
                               month,
                               onMonthChange,
                               yearDate,
                               onYearChange,
                               maxYearDate,
                               allYear,
                               onAllYearChange,
                               onGetReport,
                           }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            {/* Month Select (disabled if allYear) */}
            <FormControl sx={{ minWidth: 120 }} disabled={allYear}>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                    labelId="month-label"
                    label="Month"
                    value={month}
                    onChange={(e) => onMonthChange(e.target.value)}
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
                    onChange={onYearChange}
                    maxDate={maxYearDate}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            {/* All Year? Checkbox */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={allYear}
                        onChange={(e) => onAllYearChange(e.target.checked)}
                    />
                }
                label="All Year?"
            />

            <Button variant="contained" onClick={onGetReport}>
                Get Report
            </Button>
        </Box>
    );
}

export default MonthYearControls;
