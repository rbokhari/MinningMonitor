import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';

import config from './config';
import RigRouter from './router/RigRouter';

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();

        this.config();
        this.routes();
    }
    
    public config() {
        //use q promises
        global.Promise = require("q").Promise;
        //mongoose.Promise = global.Promise;

        
        // setup mongoose
        const MONGO_URI = config.mongoDBAddress;
        try{
            mongoose.connect(MONGO_URI || process.env.MONGODB_URI);
            console.log('mongoose connect');
        }catch(ex) {
            console.log('error', ex);
        }
        //connect to mongoose
        //let connection: mongoose.Connection = mongoose.createConnection(MONGO_URI);

        //config
        this.app.use(bodyParser.urlencoded({ extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(cors());


    }

    public routes(): void {
        let router: express.Router;
        router = express.Router();

        this.app.use('/', router);
        this.app.use('/api/v1/rigs', RigRouter);

    }

}

export default new Server().app;