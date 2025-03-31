import { useEffect, useState } from 'react';
import './App.css';
import { TrainArrival } from '../types/MartaTrainDef';
import {
    Box,
    Button,
    Divider,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    useTheme,
} from '@mui/material';
import MenuBar from './Components/MenuBar/MenuBar';
import { MARTAStations } from '../types/MartaTrainStations';
import { useMediaQuery } from '@mui/system';

function App() {
    let API_KEY = import.meta.env.VITE_MARTA_API_KEY;
    const inDev = import.meta.env.DEV;

    const [initSuccess, setInitSuccess] = useState<boolean>(false);
    const [count, setCount] = useState(0);
    const [arrivalData, setArrivalData] = useState<TrainArrival[]>([]);
    const [apiKey, setApiKey] = useState<string>('');
    const [filteredArrivalData, setFilteredArrivalData] = useState<TrainArrival[]>([]);
    const [openConfig, setOpenConfig] = useState<boolean>(true);
    const [selectedStation, setSelectedStation] = useState<string>('');
    const theme = useTheme();
    const isMobileDevice = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        console.log('in dev?', inDev);
        if (inDev) {
            console.log('Init setting up...');
            setApiKey(API_KEY);
        }
        setInitSuccess(true);
    }, []);

    // production backend
    let apiUrl = `https://marta-train-go-api.vercel.app/`;

    useEffect(() => {
        // backend via proxy for local dev only
        if (inDev) {
            apiUrl = `/meow/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
        }
        console.log('API Request:', apiUrl);
        if (!initSuccess) {
            return;
        }
        // Make the fetch request
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Success. Setting data.');
                setArrivalData(data); // Set the data from the API response
            })
            .catch((error) => {
                console.log(error);
            });
    }, [count]);

    useEffect(() => {
        if (arrivalData !== null && selectedStation !== '') {
            const data = arrivalData
                .filter(
                    (train) =>
                        train.STATION === selectedStation &&
                        train.IS_REALTIME === 'true'
                )
                .sort((a, b) => {
                    // sorting using waiting time instead of waiting seconds.
                    // this is due to returned data shows can conflicting info.
                    // NOW could have a higher waiting seconds than ARRIVING.
                    // therefore using waiting time instead.

                    // ignore case, process waiting times with NOW & ARRIVING
                    const trainA = a.WAITING_TIME.toUpperCase();
                    const trainB = b.WAITING_TIME.toUpperCase();

                    // sort() neg val a come before b; pos val b come before a; 0/NaN equal
                    // waiting time could be NOW, ARRIVING, or time like 2min
                    if (trainA === 'NOW') {
                        return -1;
                    }
                    if (trainB === 'NOW') {
                        return 1;
                    }

                    if (trainA === 'ARRIVING') {
                        if (trainB === 'NOW') {
                            return 1;
                        }
                        return -1;
                    }
                    if (trainB === 'ARRIVING') {
                        if (trainA === 'NOW') {
                            return -1;
                        }
                        return 1;
                    }

                    // process based on x min, where x is an integer
                    const timeA = parseInt(trainA);
                    const timeB = parseInt(trainB);
                    return timeA - timeB;
                });
            setFilteredArrivalData(data);
            console.log(JSON.stringify(data));
        }
    }, [arrivalData]);

    const handleStationChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        if (event !== undefined) setSelectedStation(event.target.value);
        setCount((count) => count + 1);
    };

    function getStationName(value: string): string {
        const stationProperty = MARTAStations.find(
            (station) => value === station.value
        );
        return stationProperty ? stationProperty.stationName : '';
    }

    return (
        <Box sx={{ overflow: 'auto', height: '100vh' }}>
            <MenuBar openSettings={setOpenConfig} />
            <Drawer open={openConfig}>
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
                        <Typography variant='body1'>
                            George's Version
                        </Typography>
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
                                value={selectedStation}
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
                    </Box>
                    <Button
                        variant='contained'
                        onClick={() => setOpenConfig(false)}
                        disabled={selectedStation === ''}
                    >
                        See Arrival Times!
                    </Button>
                    {isMobileDevice ? (
                        <></>
                    ) : (
                        <Typography variant='body2'>
                            Large screen detected. Simulator mode is on. Click
                            on header bar to open up this config menu again.
                        </Typography>
                    )}
                </Box>

                <Box sx={{ position: 'absolute', bottom: 0 }}>
                    <Typography sx={{ padding: 1.5 }}>
                        AVIS stands for Audio Visual Information System.
                    </Typography>
                    <Typography variant='body2' sx={{ padding: 1.5 }}>
                        Note that this is not endorsed or affiliated with MARTA
                        in any way. This project uses the publicly available
                        MARTA Train API.
                    </Typography>
                </Box>
            </Drawer>
            <div className='card'>
                <Button
                    variant='contained'
                    onClick={() => setCount((count) => count + 1)}
                >
                    Click to update. Update #{count}
                </Button>
                <p>Work in Progress!</p>
            </div>

            Welcome to {getStationName(selectedStation)} Station. Train Arrivals:
        
            {filteredArrivalData.length > 0 &&
                filteredArrivalData?.map((train) => (
                    <Box
                        key={train.TRAIN_ID}
                        sx={{
                            display: 'flex',
                            padding: 1.5,
                            '&:nth-of-type(even)': {
                                backgroundColor: 'skyblue',
                            },
                            position: 'relative',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: { xs: 1, md: 2 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    transition: 'font-size 0.3s ease-in-out',
                                    backgroundColor: `${train.LINE}`,
                                    borderRadius: { xs: 1.5, md: 2 },
                                    px: { xs: 0.5, md: 1.5 }, // px padding left right
                                }}
                            >
                                {train.LINE}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    textAlign: 'left',
                                    transition: 'font-size 0.3s ease-in-out',
                                    overflowX: 'hidden',
                                    width: '-webkit-fill-available',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {train.DESTINATION}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    transition: 'font-size 0.3s ease-in-out',
                                    width: 'min-content',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {train.WAITING_TIME}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography sx={{ textAlign: 'left' }}>
                                Train #{train.TRAIN_ID} heading{' '}
                                {train.DIRECTION}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            {filteredArrivalData.length === 0 && (
                <Typography>
                    No arrival information. Try a different station. This could
                    be due to no upcoming trains or is outside of MARTA's
                    operating hours.
                </Typography>
            )}
        </Box>
    );
}

export default App;
