import app from './app';
import { Errback } from 'express';

const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
}).on('error', (e) => {
    console.log('Error: ',e);
});