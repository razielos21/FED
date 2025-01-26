/**
 * @file MainPage.jsx
 * A central page that arranges AddCostForm, MonthlyReport, and PieChartView.
 */

// src/pages/MainPage.jsx
import 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import AddCostForm from '../components/AddCostForm';
import MonthlyReport from '../components/MonthlyReport';
import PieChartView from '../components/PieChartView';

function MainPage() {
    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Add a New Cost
                            </Typography>
                            <AddCostForm />
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <MonthlyReport />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <PieChartView />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default MainPage;
