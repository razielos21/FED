/**
 * @file AddCostForm.jsx
 * A form that allows the user to add a new cost entry, ensuring sum > 0 and defaulting date to today.
 * It uses Material-UI components: Box, Button, FormControl, InputLabel, MenuItem, Select, TextField.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 *  AddCostForm: React component
 *
 * Example usage:
 *  import AddCostForm from './AddCostForm.jsx';
 *  ReactDOM.render(<AddCostForm />, document.getElementById('root'));
 *
 *  // Optionally, provide a callback function to refresh the list after adding a cost
 *  ReactDOM.render(<AddCostForm onAddSuccess={refreshList} />, document.getElementById('root'));
 */

// Import necessary modules
import { useState } from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import { addCost } from '../idb/idbModule'; // Adjust path as needed
import PropTypes from 'prop-types';

// List of available categories for costs
const CATEGORIES = [
    'Food',
    'Transportation',
    'Rent',
    'Utilities',
    'Entertainment',
    'Other',
];

/**
 * A form that allows the user to add a new cost entry, ensuring sum > 0 and defaulting date to today.
 * @param onAddSuccess - Optional callback function to refresh the list after adding a cost
 * @returns {JSX.Element}
 * @constructor
 */
function AddCostForm({ onAddSuccess }) {
    // Helper to format date as YYYY-MM-DD
    const formatDateToYYYYMMDD = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Default date is the current date
    const today = new Date();
    // Initialize form state
    const [sum, setSum] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    // Initialize date to today's date in YYYY-MM-DD format
    const [date, setDate] = useState(formatDateToYYYYMMDD(today));

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!sum || !category || !date) {
            alert('Sum, Category, and Date are required!');
            return;
        }

        // Ensure sum is a positive number
        const sumNumber = parseFloat(sum);
        if (isNaN(sumNumber) || sumNumber <= 0) {
            alert('Sum must be a positive number!');
            return;
        }

        // Add the cost to the database
        try {
            await addCost({
                sum: sumNumber,
                category,
                description,
                date, // e.g., "2023-08-31"
            });
            alert('Cost added successfully!');

            // Clear the form
            setSum('');
            setCategory('');
            setDescription('');
            // Reset date to today (optional - or keep as last used date)
            setDate(formatDateToYYYYMMDD(new Date()));

            if (onAddSuccess) {
                onAddSuccess(); // Refresh parent list if provided
            }
        } catch (error) {
            console.error('Error adding cost:', error);
            alert('Failed to add cost. See console for details.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}
        >
            <TextField
                label="Sum"
                value={sum}
                onChange={(e) => setSum(e.target.value)}
                type="number"
                required
            />
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    {CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                InputLabelProps={{ shrink: true }}
                inputProps
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Add
            </Button>
        </Box>
    );
}

// Prop types for AddCostForm component
AddCostForm.propTypes = {
    onAddSuccess: PropTypes.func,
};

// Default props for AddCostForm component
AddCostForm.defaultProps = {
    onAddSuccess: null,
};

export default AddCostForm;
