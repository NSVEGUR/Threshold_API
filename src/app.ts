import express, { Request, Response, NextFunction } from 'express';
import config from './config';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import errorHandler from './controller/error.controller';
import AppError from './util/appError.util';
import userRouter from './routes/user.route';



const app = express();

//Helmet middle ware for securing http headers
app.use(helmet());

//Morgan to log requests in development
if (config.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}
//Body Parser , Reading data from req.body
app.use(express.json());

//For URL encoding
app.use(express.urlencoded({ extended: false }));


//For CORS (Cross origin resource sharing)
app.use(cors({
	origin: '*'
}));

//Data Sanitisation against NoSQL query injection
app.use(ExpressMongoSanitize());

//Data Sanitisation against XSS
app.use(xss());

//Prevent Parameter Pollution
app.use(hpp({
	whitelist: []//Parameters for which we don't wanna restrict duplications
}));

//ROUTES
app.use('/api/v1/users', userRouter);

//UNUSED ROUTES MIDDLEWARE
app.use('*', (req: Request, res: Response, next: NextFunction) => {
	next(new AppError(`can't find the ${req.originalUrl} on this server`, 404));
})

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);
export default app;









