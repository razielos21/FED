import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
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
import { getLastNItems, deleteCost } from '../idb/idbModule';
import AddCostForm from '../components/AddCostForm';

function MainPage() {
    const [costs, setCosts] = useState([]);

    const fetchLast15 = async () => {
        try {
            const data = await getLastNItems(15);
            setCosts(data);
        } catch (error) {
            console.error('Error fetching last 15 items:', error);
        }
    };

    useEffect(() => {
        fetchLast15();
    }, []);

    /**
     * Handle deletion of a cost record.
     * Asks for confirmation, deletes, then refreshes the table.
     */
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            await deleteCost(id);
            // Refresh the table to reflect the deletion
            fetchLast15();
        } catch (err) {
            console.error('Error deleting cost:', err);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Recent Costs (Last 15)
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sum</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Actions</TableCell> {/* For Delete */}
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

            <Typography variant="h5" gutterBottom>
                Add a New Cost
            </Typography>
            <AddCostForm onAddSuccess={fetchLast15} />
        </Box>
    );
}

export default MainPage;
