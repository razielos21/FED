import 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function AppNavbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cost Manager
                </Typography>
                <Button color="inherit" component={Link} to="/FED/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/FED/report">
                    Report
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default AppNavbar;
