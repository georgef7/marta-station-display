import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TrainArrival } from '../types/MartaTrainDef';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Proxy route to fetch data from MARTA API
app.get('/api/traindata', async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Missing API Key' });
        }

        const apiUrl = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: TrainArrival[] = await response.json() as TrainArrival[];

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));

export default app;