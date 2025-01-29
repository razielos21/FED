/**
 * @file AddCostForm.jsx
 * A form that allows the user to add a new cost entry, ensuring sum > 0 and defaulting date to today.
 */

import { useState } from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import { addCost } from '../idb/idbModule'; // Adjust path as needed
import PropTypes from 'prop-types';

const CATEGORIES = [
    'Food',
    'Transportation',
    'Rent',
    'Utilities',
    'Entertainment',
    'Other',
];

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
    const [sum, setSum] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    // Initialize date to today's date in YYYY-MM-DD format
    const [date, setDate] = useState(formatDateToYYYYMMDD(today));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!sum || !category || !date) {
            alert('Sum, Category, and Date are required!');
            return;
        }

        const sumNumber = parseFloat(sum);
        if (isNaN(sumNumber) || sumNumber <= 0) {
            alert('Sum must be a positive number!');
            return;
        }

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
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Add
            </Button>
        </Box>
    );
}

AddCostForm.propTypes = {
    onAddSuccess: PropTypes.func,
};

AddCostForm.defaultProps = {
    onAddSuccess: null,
};

export default AddCostForm;
