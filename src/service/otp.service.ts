import { NextFunction } from 'express';
import user from '../util/userType.util';
import { OtpModel } from '../model/otp.model';
import { otpType } from '../schema/otp.schema';
import AppError from '../util/appError.util';
import sendMessage from './message.service';

export default async function createOtp(data: otpType, next: NextFunction) {
	const User = user(data.role);

	//Not useful but kept to avoid ts error here
	if (!User)
		return next(new AppError('Please provide a Valid role among student, teacher, or admin', 401));

	const currentUser: any = await User.findOne({ userName: data.userName }).select('+mobile');

	//1) Return error if the user or mobile is invalid
	if (!currentUser || !await currentUser.correctMobile(data.mobile, currentUser.mobile))
		return next(new AppError(`User or mobile number is invalid`, 401));

	//2) Send Otp to the User
	const response = await sendMessage(`Authentication:\n Your OTP for Threshold is ${data.otp}\n Don't share with others`, data.mobile);

	//3) Throw error if caught any error in sending SMS
	if (response.message[0] !== 'SMS sent successfully.')
		return next(new AppError(`Something went wrong internally, Technical issue`, 500));

	const details = {
		userName: data.userName,
		otp: data.otp,
	}
	return await OtpModel.create(details);
}