import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Works after ESM fixes
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Define TrainArrival type
type TrainArrival = {
    DESTINATION: string;
    DIRECTION: 'N' | 'S' | 'E' | 'W';
    EVENT_TIME: string;
    IS_REALTIME: 'true' | 'false';
    LINE: 'GOLD' | 'RED' | 'BLUE' | 'GREEN';
    NEXT_ARR: string;
    STATION: string;
    TRAIN_ID: string;
    WAITING_SECONDS: string;
    WAITING_TIME: string;
    DELAY: string;
    LATITUDE: string;
    LONGITUDE: string;
};

// Proxy route to fetch data from MARTA API
const getTrainData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: 'Missing API Key' });
            return;
        }

        const apiUrl = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: TrainArrival[] = await response.json() as TrainArrival[];

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data); // Directly send the response, don't return it
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

// Use the typed route handler
app.get('/api/traindata', getTrainData);

// Start server
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));

export default app;