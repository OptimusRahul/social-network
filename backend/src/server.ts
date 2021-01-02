import mongoose from 'mongoose';

import app from './app';
import { dbConfig } from './config/index';

// DB CREDENTIALS
const { DATABASE, DATABASE_PASSWORD } = dbConfig;

// DB_URI
const db_uri = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

// Mongoose Setup
mongoose.Promise = global.Promise;

// Mongoose Connection
mongoose.connect(db_uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected succesfully');
}).catch(err => {
    console.log('Connection error');
})

const port = process.env.port || 5000;

// mongoose.set('debug', true);

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
}).on('error', (e) => {
    console.log('Error: ',e);
});