import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box } from '@mui/system';
import { AllTrainInfo } from './types/MartaTrainDef';
import { TextField } from '@mui/material';


function App() {
  const [count, setCount] = useState(0)
  let API_KEY = import.meta.env.VITE_MARTA_API_KEY;
  const inDev = import.meta.env.DEV

  const [trains, setTrains] = useState<AllTrainInfo | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');

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
    // Define the API endpoint
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
        setTrains(data);  // Set the data from the API response
      })
      .catch((error) => {
        console.log(error)
      });
  }, [apiKey]); 

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
      <TextField id="outlined-basic" label="Enter API Key" variant="outlined" onChange={handleChange}/>
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
      <Box>
        {JSON.stringify(trains)}
      </Box>
    </>
  )
}

export default App
