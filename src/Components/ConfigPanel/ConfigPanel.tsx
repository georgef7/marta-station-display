import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    Checkbox,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { MARTAStations } from '../../../types/MartaTrainStations';
import { useMediaQuery, useTheme } from '@mui/system';

export type ConfigPanelProps = {
    openConfig: boolean;
    selectedStation: string;
    setSelectedStation: (station: string) => void;
    showRealTimeArrivalOnly: boolean;
    setShowRealTimeArrivalOnly: (selection: boolean) => void;
    setOpenConfig: (open: boolean) => void;
};

export default function ConfigPanel(props: ConfigPanelProps) {
    const theme = useTheme();
    const isMobileDevice = useMediaQuery(theme.breakpoints.down('md'));

    const handleStationChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        if (event !== undefined) props.setSelectedStation(event.target.value);
    };

    const handleShowRealTimeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        props.setShowRealTimeArrivalOnly(event.target.checked);
    };

    return (
        <Drawer open={props.openConfig}>
            <Box
                sx={{
                    padding: 1.5,
                    gap: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 350,
                }}
            >
                <Box>
                    <Typography variant='h4'>MARTA AVIS Display</Typography>
                    <Typography variant='body1'>George's Version</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography variant='h5'>Config Settings</Typography>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id='station-select-autowidth-label'>
                            Station
                        </InputLabel>
                        <Select
                            labelId='station-select-autowidth-label'
                            id='station-select-autowidth'
                            value={props.selectedStation}
                            onChange={handleStationChange}
                            autoWidth
                            label='Station'
                        >
                            {MARTAStations.map((station) => (
                                <MenuItem
                                    key={station.value}
                                    value={station.value}
                                >
                                    {station.stationName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.showRealTimeArrivalOnly}
                                onChange={handleShowRealTimeChange}
                            />
                        }
                        label='Show Real Time Arrivals Only'
                    />
                </Box>
                <Button
                    variant='contained'
                    onClick={() => props.setOpenConfig(false)}
                    disabled={props.selectedStation === ''}
                >
                    See Arrival Times!
                </Button>
                {isMobileDevice ? (
                    <Typography variant='body2'>
                        Small screen detected. Simulator mode is off. To use
                        simulator mode, open on a larger screen.
                    </Typography>
                ) : (
                    <Typography variant='body2'>
                        Large screen detected. Simulator mode is on. Click on
                        header bar to open up this config menu again.
                    </Typography>
                )}
            </Box>

            <Box sx={{ position: 'absolute', bottom: 0 }}>
                <Typography sx={{ padding: 1.5 }}>
                    AVIS stands for Audio Visual Information System.
                </Typography>
                <Typography variant='body2' sx={{ padding: 1.5 }}>
                    Note: The MARTA API will sometimes respond with incomplete
                    data. If data is unavailable for a station/line, please try
                    a different station or try again later.
                </Typography>
                <Typography variant='body2' sx={{ padding: 1.5 }}>
                    Note that this is not endorsed or affiliated with MARTA in
                    any way. This project uses the publicly available MARTA
                    Train API.
                </Typography>
            </Box>
        </Drawer>
    );
}
