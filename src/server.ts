import mongoose from 'mongoose';
import app from './app';
import config from './config';


//Connecting to MongoDB
const db = config.DBURL.replace('<PASSWORD>', config.DBPASSWORD);


mongoose.connect(db).then(con => {
	console.log('DB Connection made successful');
})


const port = config.PORT || 8000;


//Listening to the server
const server = app.listen(port, () => {
	console.log(`Vegur's MacBook listening your request from port ${port}`);
});
