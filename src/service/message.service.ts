import fast2sms from 'fast-two-sms';
import config from 'config';

export default async function sendMessage(message: string, number: string) {
	var options = {
		authorization: config.get('fast2smsApiKey'),
		message,
		numbers: [number]
	};
	const response = await fast2sms.sendMessage(options);
	return response;
}