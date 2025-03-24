import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

interface MenuBarProps {
    openSettings: (open: boolean) => void;
}

export default function MenuBar(props: MenuBarProps) {
    // current time without seconds, with AM/PM
    const [currentTime, setCurrentTime] = React.useState<string>(new Date().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'}));
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'}));
        }, 1000);

        return () => clearInterval(interval);
    })

    const handleIconButton = () => {
        props.openSettings(true);
    }

    return (
        <Box sx={{ flexGrow: 2 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleIconButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5">
                        MARTA Train Arrival Times
                    </Typography>
                    <Typography variant='h5' sx={{right: '1%', position: 'fixed'}}>{currentTime}</Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
