import { prop, pre, getModelForClass } from "@typegoose/typegoose";
import bcrypt from 'bcryptjs';
import config from './../config';


@pre<Otp>('save', async function (next) {
	if (!this.isModified('otp')) {
		return;
	}
	//Hash the OTP with cost of 12
	this.otp = await bcrypt.hash(this.otp, 12);
	next();
})


export class Otp {
	[x: string]: any;

	//PROPERTIES
	@prop({ required: true, lowercase: true })
	userName: string;

	@prop({ required: true })
	otp: string;

	@prop({ required: true, default: Date.now, expires: config.OTP_EXPIRY_TIME })
	expireAt: Date;

	//To compare the encrypted password
	async correctOtp(candidateOtp: string, userOtp: string) {
		return await bcrypt.compare(candidateOtp, userOtp);
	}
}

export const OtpModel = getModelForClass(Otp);