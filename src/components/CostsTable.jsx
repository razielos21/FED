/**
 * @file CostsTable.jsx
 * This file provides a table component for displaying cost items.
 * It uses Material-UI components: Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 *  CostsTable: React component
 *
 * Example usage:
 *  import CostsTable from './CostsTable.jsx';
 *  ReactDOM.render(<CostsTable costs={data} onDelete={handleDelete} />, document.getElementById('root'));
 *  // where data is an array of objects like [{ id, date, category, sum, description }, ...]
 *  // and handleDelete is a function to delete a cost item by ID
 */

// Import necessary modules
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
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";

/**
 * A table component for displaying cost items.
 * @param costs - Array of cost items with properties: id, date, category, sum, description
 * @param onDelete - Function to delete a cost item by ID
 * @returns {JSX.Element}
 * @constructor
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
                                <Tooltip title="Delete">
                                <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// Prop types for CostsTable component
CostsTable.propTypes = {
    costs: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CostsTable;
