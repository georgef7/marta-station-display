import { useEffect, useState } from 'react';
import './App.css';
import { TrainArrival } from '../types/MartaTrainDef';
import {
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import MenuBar from './Components/MenuBar/MenuBar';
import {
    ArrivingTranslation,
    MARTAStations,
} from '../types/MartaTrainStations';
import { useMediaQuery } from '@mui/system';
import ConfigPanel from './Components/ConfigPanel/ConfigPanel';

function App() {
    let API_KEY = import.meta.env.VITE_MARTA_API_KEY;
    const inDev = import.meta.env.DEV;

    const [initSuccess, setInitSuccess] = useState<boolean>(false);
    //const [count, setCount] = useState(0);
    const [showRealTimeArrivalOnly, setShowRealTimeArrivalOnly] =
        useState<boolean>(true);
    const [arrivalData, setArrivalData] = useState<TrainArrival[]>([]);
    const [apiKey, setApiKey] = useState<string>('');
    const [filteredArrivalData, setFilteredArrivalData] = useState<TrainArrival[]>([]);
    const [openConfig, setOpenConfig] = useState<boolean>(true);
    const [selectedStation, setSelectedStation] = useState<string>('');
    const [languageIndex, setLanguageIndex] = useState<number>(0);
    const [trainArriving, setTrainArriving] = useState<boolean>(false);
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

    const fetchArrivalTimes = async () => {
        try {
            // make fetch request to back end
            console.log('fetching.......');
            const fetchResponse = await fetch(apiUrl);
            if (!fetchResponse.ok) {
                throw new Error('fetch response was not ok!');
            }
            const data = await fetchResponse.json();
            setArrivalData(data);
        } catch (error) {
            console.log('something went wrong while fetching data', error);
        }
    };

    useEffect(() => {
        // backend via proxy for local dev only
        if (inDev) {
            apiUrl = `/meow/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
        }
        console.log('API Request:', apiUrl);
        if (!initSuccess) {
            console.log('Something went wrong. Init was not successful.');
            return;
        }
        console.log('init success! now auto fetching data');

        // fetch on load
        fetchArrivalTimes();

        // auto fetch every 15 sec
        const fetchInterval = setInterval(fetchArrivalTimes, 15000);

        return () => clearInterval(fetchInterval);
    }, [initSuccess]);

    useEffect(() => {
        if (arrivalData !== null && selectedStation !== '') {
            let data: TrainArrival[] = [];
            if (showRealTimeArrivalOnly) {
                data = arrivalData.filter(
                    (train) =>
                        train.STATION === selectedStation &&
                        train.IS_REALTIME === 'true'
                );
            } else {
                data = arrivalData.filter(
                    (train) => train.STATION === selectedStation
                );
            }
            const filteredArrivalData = data.sort((a, b) => {
                // sorting using waiting time instead of waiting seconds.
                // this is due to returned data can show conflicting info.
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

            // limit to 4 trains on simulator mode
            if (!isMobileDevice) {
                setFilteredArrivalData(filteredArrivalData.slice(0, 3));
            } else {
                setFilteredArrivalData(filteredArrivalData);
            }

            setTrainArriving(
                filteredArrivalData.some(
                    (train) => train.WAITING_TIME === 'Arriving'
                )
            );
            console.log(JSON.stringify(filteredArrivalData));
        } else {
            console.log('no selected station');
        }
    }, [selectedStation, showRealTimeArrivalOnly, arrivalData]);

    useEffect(() => {
        if (isMobileDevice || !trainArriving) {
            console.log('not running multi language for arriving');
            // don't run on mobile devices and if no trains are arriving
            return;
        }
        const updateLanguage = () => {
            setLanguageIndex(
                (prevIndex) => (prevIndex + 1) % ArrivingTranslation.length
            );
        };
        console.log('running multi language for arriving');
        // Get the duration for the current language
        const delay = ArrivingTranslation[languageIndex].duration;
        const interval = setTimeout(updateLanguage, delay);

        return () => clearTimeout(interval);
    }, [languageIndex, isMobileDevice, trainArriving]);

    useEffect(() => {
        // reset so Arriving is always first displayed
        setLanguageIndex(0);
    }, [!trainArriving]);

    function getStationName(value: string): string {
        const stationProperty = MARTAStations.find(
            (station) => value === station.value
        );
        return stationProperty ? stationProperty.stationName : '';
    }

    function getLocalizedWaitingTime(eta: string): string | number {
        if (eta === 'Arriving') {
            return ArrivingTranslation[languageIndex].text;
        }
        return eta;
    }

    return (
        <Box sx={{ overflow: 'auto', height: '100vh' }}>
            <MenuBar openSettings={setOpenConfig} />
            <ConfigPanel openConfig={openConfig} selectedStation={selectedStation} setSelectedStation={setSelectedStation}
                showRealTimeArrivalOnly={showRealTimeArrivalOnly} setShowRealTimeArrivalOnly={setShowRealTimeArrivalOnly}
                setOpenConfig={setOpenConfig}/>
            <div className="card">
                {/* <Button
                    variant='contained'
                    onClick={() => setCount((count) => count + 1)}
                >
                    Click to update. Update #{count}
                </Button> */}
                <p>Work in Progress!</p>
            </div>
            Welcome to {getStationName(selectedStation)} Station. Train
            Arrivals:
            {filteredArrivalData.length > 0 &&
                filteredArrivalData?.map((train) => (
                    <Box
                        key={
                            train.TRAIN_ID +
                            train.DESTINATION +
                            train.WAITING_SECONDS
                        }
                        sx={{
                            display: 'flex',
                            padding: 1.5,
                            '&:nth-of-type(even)': {
                                backgroundColor: 'skyblue',
                            },
                            position: 'relative',
                            flexDirection: 'column',
                            height: { xs: '10%', md: '20%' },
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: { xs: 1, md: 2 },
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                        transition:
                                            'font-size 0.3s ease-in-out',
                                        backgroundColor: `${train.LINE}`,
                                        borderRadius: { xs: 1.5, md: 2 },
                                        width: { xs: '100px', md: '125px' },
                                        px: { xs: 0.5, md: 1.5 }, // px padding left right
                                    }}
                                >
                                    {train.LINE}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    textAlign: 'left',
                                    transition: 'font-size 0.3s ease-in-out',
                                    overflowX: 'hidden',
                                    width: '-webkit-fill-available',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {train.DESTINATION}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    transition: 'font-size 0.3s ease-in-out',
                                    width: 'min-content',
                                    alignSelf: 'center',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'bold',
                                }}
                            >
                                {isMobileDevice ? (
                                    <>{train.WAITING_TIME}</>
                                ) : (
                                    getLocalizedWaitingTime(train.WAITING_TIME)
                                )}
                            </Typography>
                        </Box>

                        <Box>
                            {train.TRAIN_ID !== '' ? (
                                <Typography sx={{ textAlign: 'left' }}>
                                    Train #{train.TRAIN_ID} heading{' '}
                                    {train.DIRECTION}
                                </Typography>
                            ) : (
                                <Typography sx={{ textAlign: 'left' }}>
                                    Scheduled train heading {train.DIRECTION}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            {filteredArrivalData.length === 0 && (
                <Typography>
                    No arrival information. Try a different station. This could
                    be due to no upcoming trains or is outside of MARTA's
                    operating hours or MARTA's API responded with incomplete arrival data.
                </Typography>
            )}
        </Box>
    );
}

export default App;
