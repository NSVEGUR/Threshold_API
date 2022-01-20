import fast2sms from 'fast-two-sms';
import config from './../config';

export default async function sendMessage(message: string, number: string) {
	var options = {
		authorization: config.FAST2SMS_API_KEY,
		message,
		numbers: [number]
	};
	const response = await fast2sms.sendMessage(options);
	return response;
}