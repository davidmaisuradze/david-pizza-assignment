import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.Promise = global.Promise;
try {
    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
} catch (err) {
    console.log(err, 'mongoose connection error');
}

mongoose.connection
    .once('open', () => console.log('MongoDB running'))
    .on('error', e => {
        throw e
    });
