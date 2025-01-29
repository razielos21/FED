/**
 * @file CategoryPieChart.jsx
 * A pie chart component that displays a breakdown of costs by category.
 * It uses the Recharts library.
 * It is intended for use in a React environment (ES Modules).
 *
 * Exports:
 *  CategoryPieChart: React component
 *
 * Example usage:
 *  import CategoryPieChart from './CategoryPieChart.jsx';
 *  ReactDOM.render(<CategoryPieChart data={data} colorArray={colorArray} />, document.getElementById('root'));
 *  // where data is an array like [{ category, total }, ...]
 *  // and colorArray is an array of string color codes
 *  // e.g., ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
 */

// Import necessary modules
import 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A pie chart component that displays a breakdown of costs by category.
 * @param chartData - Array of objects with category and total properties
 * @param colors - Array of string color codes
 * @returns {JSX.Element}
 * @constructor
 */
function CategoryPieChart({ chartData, colors }) {
    // Display a message if there is no data
    if (!chartData || chartData.length === 0) {
        return <Typography>No data to display.</Typography>;
    }

    return (
        <PieChart width={400} height={300} style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '14px' }}>
            <Pie data={chartData} dataKey="total" nameKey="category" outerRadius={100} label>
                {chartData.map((entry, index) => (
                    <Cell key={entry.category} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
}

// Prop types for CategoryPieChart component
CategoryPieChart.propTypes = {
    chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// Default props for CategoryPieChart component
CategoryPieChart.defaultProps = {
    chartData: [],
    colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
}

export default CategoryPieChart;
