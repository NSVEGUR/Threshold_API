import { Request, Response, NextFunction } from 'express';
import catchAsync from "../util/catchAsync.util";
import createOtp from '../service/otp.service';
import otpGenerator from 'otp-generator';
import validateOtpResource from '../util/validOtpResourse.util';
import { otpSchema, otpType } from '../schema/otp.schema';
import user from '../util/userType.util';
import { OtpModel } from '../model/otp.model';
import AppError from '../util/appError.util';


const sendOtp = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	//1) Generate Otp and Save it to database
	const otp = otpGenerator.generate(6, {
		digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
	});
	const details = {
		userName: req.body.userName,
		mobile: req.body.mobile,
		role: req.body.role,
		otp
	}
	validateOtpResource(otpSchema, details, next);
	await createOtp(details, next);
	res.status(200).json({
		status: 'success',
		message: 'OTP sent Successfully!'
	});
});

const verifyOtp = catchAsync(async function (
	req: Request<{}, {}, otpType>,
	res: Response,
	next: NextFunction
) {
	const { userName, role, mobile, otp } = req.body;
	const User = user(role);

	//Ts Error
	if (!User)
		return next(new AppError('Please provide a Valid role among student, teacher, or admin', 401));

	//1)Checking current user
	const currentUser: any = await User.findOne({ userName });
	if (!currentUser) return next(new AppError('Something is wrong with the current user', 500));

	//2)Checking if otp has expired
	const OtpDoc = await OtpModel.find({ userName });
	if (OtpDoc.length === 0) return next(new AppError('Your OTP has been expired', 400));

	//3) Verifying by selecting the most recent otp if user generated otp many times
	const recentOtp = OtpDoc[OtpDoc.length - 1];
	if (!await recentOtp.correctOtp(otp, recentOtp.otp))
		return next(new AppError('Invalid OTP', 404));

	const token = await currentUser.signToken(role);

	//4) Sending Successful response if everything goes upto here right 
	res.status(200).json({
		status: 'success',
		message: 'User Verified Successfully!',
		token
	});

	//5) Delete the Otps for that username
	await OtpModel.deleteMany({ userName });
})

export {
	sendOtp,
	verifyOtp,
}