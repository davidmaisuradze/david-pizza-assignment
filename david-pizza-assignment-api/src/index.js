import express from 'express';
import middlewaresConfig from './config/middlewares';
import './config/database';
import ApiRoutes from './routes';
import path from 'path'

const app = express();
// wrap all the middlewares
middlewaresConfig(app);

// add the apiRoutes
app.use('/api', ApiRoutes);
app.use('/static', express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 4500;
app.listen(port, () => console.log(`Running on localhost: ${port}`));
