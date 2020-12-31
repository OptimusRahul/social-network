import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import app from './app';

dotenv.config();

if(!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    process.exit(1);
}

const db_uri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.Promise = global.Promise;

mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected succesfully');
}).catch(err => {
    console.log('Connection error');
})

const port = process.env.port || 5000;

mongoose.set('debug', true);

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
}).on('error', (e) => {
    console.log('Error: ',e);
});