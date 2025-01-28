import 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Typography } from '@mui/material';

/**
 * Props:
 * - chartData: array like [{ category, total }, ...]
 * - colors: array of string color codes
 */
function CategoryPieChart({ chartData, colors }) {
    if (!chartData || chartData.length === 0) {
        return <Typography>No data to display.</Typography>;
    }

    return (
        <PieChart width={400} height={300}>
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

export default CategoryPieChart;
