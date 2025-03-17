import { useEffect, useState } from 'react'
import './App.css'
import { TrainArrival } from '../types/MartaTrainDef';

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

    // production backend
    let apiUrl = `https://marta-train-go-api.vercel.app/`;    

    useEffect(() => {
        // via proxy
        if (inDev) {
            apiUrl = `${baseURL}/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
        }
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
            <h2>The ATL MARTA AVIS Display, George's Version.</h2>
            <p>Note that this is not endorsed or affiliated with MARTA in any way. This project uses the publicly available MARTA Train API.</p>
            
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    Refresh # {count}
                </button>
                <p>
                    Work in Progress!
                </p>
            </div>
            Welcome to Lindbergh Station. Train Arrivals:
            {filteredArrivalData?.map(train => (
                <div key={train.TRAIN_ID}>
                    {train.LINE} Line Train {train.TRAIN_ID} heading {train.DIRECTION} to {train.DESTINATION} will arrive in {train.WAITING_TIME}
                </div>
            ))}

        </>
    )
}

export default App
