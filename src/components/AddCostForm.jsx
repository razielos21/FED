/**
 * @file AddCostForm.jsx
 * A form that allows the user to add a new cost entry with a fixed category list.
 */

import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { addCost } from '../idb/idbModule'; // Adjust import to your IndexedDB module path

const CATEGORIES = [
    'Food',
    'Transportation',
    'Rent',
    'Utilities',
    'Entertainment',
    'Other',
];

function AddCostForm() {
    const [sum, setSum] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation checks
        if (!sum || !category || !date) {
            alert('Sum, Category, and Date are required!');
            return;
        }

        try {
            await addCost({
                sum: parseFloat(sum),
                category,
                description,
                date, // in YYYY-MM-DD format
            });
            alert('Cost added successfully!');

            // Clear the form
            setSum('');
            setCategory('');
            setDescription('');
            setDate('');
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

export default AddCostForm;
