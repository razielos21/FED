import 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Renders a table of cost items.
 * @param {{ costs: Array, onDelete: Function }} props
 */
function CostsTable({ costs, onDelete }) {
    return (
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
                                    onClick={() => onDelete(item.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CostsTable;
