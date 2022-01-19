require('dotenv').config();
import config from 'config';
import mongoose from 'mongoose';
import app from './app';


//Connecting to MongoDB
const db = config.get<string>('dbUrl').replace('<PASSWORD>', config.get('dbPassword'));


mongoose.connect(db).then(con => {
	console.log('DB Connection made successful');
})


const port = config.get('port') || 8000;


//Listening to the server
const server = app.listen(port, () => {
	console.log(`Vegur's MacBook listening your request from port ${port}`);
});
