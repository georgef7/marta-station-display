import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TrainArrival } from './types/MartaTrainDef';
import { TextField } from '@mui/material';
import demoData from './assets/DemoData.json'


function App() {
    const [count, setCount] = useState(0)
    let API_KEY = import.meta.env.VITE_MARTA_API_KEY;
    const inDev = import.meta.env.DEV

    const [arrivalData, setArrivalData] = useState<TrainArrival[]>([]);
    const [apiKey, setApiKey] = useState<string>('');
    const [baseURL, setBaseURL] = useState<string>('');
    const [filteredArrivalData, setFilteredArrivalData] = useState<TrainArrival[]>([]);

    useEffect(() => {
        console.log('in dev?', inDev);
        if (inDev) {
            console.log('Init setting up...')
            setApiKey(API_KEY);
            setBaseURL('/meow');
        } else {
            setApiKey('');
            setBaseURL('https://developerservices.itsmarta.com:18096');
        }
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value); // Update state on input change
    };


    useEffect(() => {
        if (inDev) {
            const apiUrl = `${baseURL}/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
            console.log('API Request:', apiUrl);
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
        } else {
            setArrivalData(demoData as TrainArrival[])
        }
    }, [count]);

    useEffect(() => {
        console.log('setting it...')
        if (arrivalData !== null) {
            const data = arrivalData.filter(train => train.STATION === 'LINDBERGH STATION' && train.IS_REALTIME === 'true')
            console.log('the filtered data', data)
            setFilteredArrivalData(data)
        }
    }, [arrivalData])

    return (
        <>

            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>The ATL MARTA AVIS Display, George's Version.</h1>
            <p>Note that this is not endorsed or affiliated with MARTA in any way. This project uses the publicly available MARTA Train API.</p>
            <TextField id="outlined-basic" label="Enter API Key" variant="outlined" onChange={handleChange} />
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Work in Progress!
                </p>
            </div>
            <p className="read-the-docs">
                This project is created with Vite and uses React. Click on the Vite and React logos to learn more
            </p>
            Welcome to Lindbergh Station. Train Arrivals:
            {filteredArrivalData?.map(train => (
                <div key={train.TRAIN_ID}>
                    {train.LINE} Line Train {train.TRAIN_ID} heading {train.DIRECTION} to {train.DESTINATION} will arrive in {train.WAITING_TIME}
                </div>
            ))}
            {inDev ? 'Live Data' : 'Viewing demo data for now due to CORS restrictions as this is in production environment.'}


        </>
    )
}

export default App
