import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './../config.env') });



// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file

interface ENV {
	NODE_ENV: string | undefined;
	PORT: number | undefined;
	DBURL: string | undefined;
	DBPASSWORD: string | undefined;
	JWT_SECRET: string | undefined;
	JWT_EXPIRES_IN: string | undefined;
	JWT_COOKIE_EXPIRES_IN: string | undefined;
	OTP_EXPIRY_TIME: string | undefined;
	FAST2SMS_API_KEY: string | undefined;
}


interface Config {
	NODE_ENV: string;
	PORT: number;
	DBURL: string;
	DBPASSWORD: string;
	JWT_SECRET: string;
	JWT_EXPIRES_IN: string;
	JWT_COOKIE_EXPIRES_IN: string;
	OTP_EXPIRY_TIME: string;
	FAST2SMS_API_KEY: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
	return {
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
		DBURL: process.env.DBURL,
		DBPASSWORD: process.env.DBPASSWORD,
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
		JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
		OTP_EXPIRY_TIME: process.env.OTP_EXPIRY_TIME,
		FAST2SMS_API_KEY: process.env.FAST2SMS_API_KEY,
	};
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
	for (const [key, value] of Object.entries(config)) {
		if (value === undefined) {
			throw new Error(`Missing key ${key} in config.env`);
		}
	}
	return config as Config;
};


const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;