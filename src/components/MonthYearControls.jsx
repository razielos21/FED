/**
 * @file MonthYearControls.jsx
 * A component that provides controls for selecting a month and year, with an option to select all months in a year.
 * It uses Material-UI components: Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Checkbox, FormControlLabel.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 *  MonthYearControls: React component
 *
 * Example usage:
 *  import MonthYearControls from './MonthYearControls.jsx';
 *  ReactDOM.render(<MonthYearControls />, document.getElementById('root'));
 *
 *  // Optionally, provide props to control the component's behavior
 *  ReactDOM.render(<MonthYearControls month={1} yearDate={new Date()} />, document.getElementById('root'));
 *  // where month is a number (1-12) and yearDate is a Date object
 */

// Import necessary modules
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
import PropTypes from 'prop-types';

// List of months for the month select
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
 * - month (string|number) - month value (1-12)
 * - onMonthChange(newMonth) - callback when month is changed
 * - yearDate (Date object) - selected year
 * - onYearChange(newDate) - callback when year is changed
 * - maxYearDate (Date) - limit year selection
 * - allYear (boolean) - all year selected?
 * - onAllYearChange(newValue) - callback when allYear is changed
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

// Prop types for MonthYearControls component
MonthYearControls.propTypes = {
    month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onMonthChange: PropTypes.func,
    yearDate: PropTypes.instanceOf(Date),
    onYearChange: PropTypes.func,
    maxYearDate: PropTypes.instanceOf(Date),
    allYear: PropTypes.bool,
    onAllYearChange: PropTypes.func,
    onGetReport: PropTypes.func,
};

export default MonthYearControls;
