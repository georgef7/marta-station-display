import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/system';

interface MenuBarProps {
    openSettings: (open: boolean) => void;
}

export default function MenuBar(props: MenuBarProps) {
    // current time without seconds, with AM/PM
    const [currentTime, setCurrentTime] = React.useState<string>(new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }));
    const theme = useTheme();
    const isMobileDevice = useMediaQuery(theme.breakpoints.down('md'));

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }));
        }, 1000);

        return () => clearInterval(interval);
    })

    const handleIconButton = () => {
        props.openSettings(true);
    }

    return (
        // Mobile device will use menu button to open config, large screens will act as arrival display simulator - uses menu bar to open
        <Box sx={{ flexGrow: 2 }} onClick={isMobileDevice ? undefined : handleIconButton}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2, display: {sx: 'block', md: 'none'} }}
                        onClick={handleIconButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography sx={{
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        transition: 'font-size 0.3s ease-in-out'
                    }}>
                        MARTA Train Arrival Times
                    </Typography>
                    <Typography variant='h5'
                        sx={{
                            right: '1%',
                            position: 'absolute',
                            display: { xs: 'none', md: 'block' }
                        }}>
                        {currentTime}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
