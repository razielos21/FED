import 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function AppNavbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div">
                    Cost Manager
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default AppNavbar;