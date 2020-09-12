import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

export default app => {
    app.use(compression());
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(cors());
}
