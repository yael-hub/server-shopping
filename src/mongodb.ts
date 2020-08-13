import { connect, model } from 'mongoose';
import { Musician } from './collections/musician';

const MONGODB_URL = 'mongodb://localhost:27017'; 
const DB_NAME = 'chen';


export const collections = {
    Musician,
}


// run this when the server is starting
export async function connectDb() {
    await connect(MONGODB_URL, {
        dbName: DB_NAME,
        useNewUrlParser: true,
    });
}