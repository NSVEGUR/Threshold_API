export namespace NodeJS {
	interface ProcessEnv {
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
}