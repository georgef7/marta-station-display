import { useEffect, useState } from 'react'
import './App.css'
import { TrainArrival } from '../types/MartaTrainDef';
import { Box, Button, Divider, Drawer, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import MenuBar from './Components/MenuBar/MenuBar';
import { MARTAStations } from '../types/MartaTrainStations';

function App() {
    let API_KEY = import.meta.env.VITE_MARTA_API_KEY;
    const inDev = import.meta.env.DEV

    const [initSuccess, setInitSuccess] = useState<boolean>(false);
    const [count, setCount] = useState(0)
    const [arrivalData, setArrivalData] = useState<TrainArrival[]>([]);
    const [apiKey, setApiKey] = useState<string>('');
    const [filteredArrivalData, setFilteredArrivalData] = useState<TrainArrival[]>([]);
    const [openConfig, setOpenConfig] = useState<boolean>(true);
    const [selectedStation, setSelectedStation] = useState<string>('');

    useEffect(() => {
        console.log('in dev?', inDev);
        if (inDev) {
            console.log('Init setting up...')
            setApiKey(API_KEY);

        }
        setInitSuccess(true)
    }, []);

    // production backend
    let apiUrl = `https://marta-train-go-api.vercel.app/`;

    useEffect(() => {
        // via proxy
        if (inDev) {
            apiUrl = `/meow/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
        }
        console.log('API Request:', apiUrl);
        if (!initSuccess) {
            return
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
                console.log('Success. Setting data.')
                setArrivalData(data);  // Set the data from the API response
            })
            .catch((error) => {
                console.log(error)
            });

    }, [count]);

    useEffect(() => {
        if (arrivalData !== null && selectedStation !== '') {
            const data = arrivalData.filter(train => train.STATION === selectedStation && train.IS_REALTIME === 'true')
            console.log('the filtered data', data)
            setFilteredArrivalData(data)
        }
    }, [arrivalData])

    const handleStationChange = (event: SelectChangeEvent) => {
        console.log(event.target.value)
        if (event !== undefined)
            setSelectedStation(event.target.value);
        setCount((count) => count + 1)
    };

    function getStationName(value: string): string {
        const stationProperty = MARTAStations.find((station) => value === station.value)
        return stationProperty ? stationProperty.stationName : '';
    }

    return (
        <>
            <MenuBar openSettings={setOpenConfig} />
            <Drawer open={openConfig} onClose={() => setOpenConfig(false)}>
                <Box sx={{ padding: 1.5, gap: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                        <Typography variant='h4'>MARTA AVIS Display</Typography>
                        <Typography variant='body1'>George's Version</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant='h5'>Config Settings</Typography>
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="station-select-autowidth-label">Station</InputLabel>
                            <Select
                                labelId="station-select-autowidth-label"
                                id="station-select-autowidth"
                                value={selectedStation}
                                onChange={handleStationChange}
                                autoWidth
                                label="Station"
                            >
                                {MARTAStations.map((station) => (
                                    <MenuItem key={station.value} value={station.value}>{station.stationName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant='contained' onClick={() => setOpenConfig(false)}>See Arrival Times!</Button>

                </Box>

                <Box sx={{ position: 'absolute', bottom: 0 }}>
                    <Typography sx={{ padding: 1.5 }}>
                        AVIS stands for Audio Visual Information System.
                    </Typography>
                    <Typography variant='body2' sx={{ padding: 1.5 }}>
                        Note that this is not endorsed or affiliated with MARTA in any way.
                        This project uses the publicly available MARTA Train API.
                    </Typography>
                </Box>

            </Drawer>

            <div className="card">
                <Button variant='contained' onClick={() => setCount((count) => count + 1)}>
                    Click to update. Update #{count}
                </Button>
                <p>
                    Work in Progress!
                </p>
            </div>

            Welcome to {getStationName(selectedStation)} Station. Train Arrivals:
            {filteredArrivalData.length > 0 && filteredArrivalData?.map(train => (
                <div key={train.TRAIN_ID}>
                    {train.LINE} Line Train {train.TRAIN_ID} heading {train.DIRECTION} to {train.DESTINATION} will arrive in {train.WAITING_TIME}
                </div>
            ))}

            {filteredArrivalData.length === 0 &&
                <>
                    No arrival information. Try a different station.
                    This could be due to no upcoming trains or is outside of MARTA's operating hours.
                </>
            }

        </>
    )
}

export default App
