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
 *  ReactDOM.render(<CategoryPieChart chartData={data} colors={colorArray} />, document.getElementById('root
 *  // where data is an array like [{ category, total }, ...]
 *  // and colorArray is an array of string color codes
 *  // e.g., ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
 */

// Import necessary modules
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

// Mapping of categories to colors
const CATEGORY_COLORS = {
    'Food': '#FF6384',
    'Transportation': '#ff974a',
    'Rent': '#ffb100',
    'Utilities': '#4BC0C0',
    'Entertainment': '#9966FF',
    'Other': '#858585',
};

function CategoryPieChart({ chartData }) {
    if (!chartData || chartData.length === 0) {
        return <Typography>No data to display.</Typography>;
    }

    return (
        <PieChart width={400} height={300}
                  style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '14px' }}>
            <Pie data={chartData} dataKey="total" nameKey="category" outerRadius={100} label>
                {chartData.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
}

CategoryPieChart.propTypes = {
    chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CategoryPieChart.defaultProps = {
    chartData: [],
};

export default CategoryPieChart;


