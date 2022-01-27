import { Request, Response, NextFunction } from 'express';
import { userType } from '../schema/user.schema';
import { loginType } from '../schema/login.schema';
import user from '../util/userType.util';
import catchAsync from '../util/catchAsync.util';
import createUser from '../service/user.service';
import AppError from '../util/appError.util';
import { UserModel } from '../model/user.model';

interface userExistanceType {
	userName: string;
}

const signup = catchAsync(async function (
	req: Request<{}, {}, userType>,
	res: Response,
	next: NextFunction
) {
	const newUser: any = await createUser(req.body, next);
	newUser.password = undefined;
	const { role } = req.body;
	const token = await newUser.signToken(role);
	// if (config.NODE_ENV == 'development')
	return res.status(201).json({
		status: 'success',
		message: 'user created successfully',
		data: {
			token,
			user: newUser
		}
	});
	// else {
	// 	//Call Next function (Send OTP) in the middleware if User is created successfully
	// 	next();
	// };
});

const login = catchAsync(async function (
	req: Request<{}, {}, loginType>,
	res: Response,
	next: NextFunction
) {
	const { userName, role, password, mobile } = req.body;

	//2) Check user exist and password is correct
	const currentUser: any = await UserModel.findOne({ userName: userName }).select('+password').select('+mobile');
	if (!currentUser || !await currentUser.correctPassword(password, currentUser.password)) {
		return next(new AppError('Incorrect User Name or Password', 404));
	}

	if (currentUser.__t != role) {
		return next(new AppError(`You are not a ${role}`, 404));
	}

	if (!await currentUser.correctMobile(mobile, currentUser.mobile)) {
		return next(new AppError('Not Your Mobile Number', 404));
	}



	currentUser.password = undefined;
	const token = await currentUser.signToken(role);
	// if (config.NODE_ENV == 'development')
	return res.status(201).json({
		status: 'success',
		message: 'loggedInSuccessfully',
		data: {
			token,
			user: currentUser
		}
	});
	// else {
	// 	//Call Next function (Send OTP) in the middleware if User is created successfully
	// 	next();
	// };
});


const checkUserExistance = catchAsync(async function (
	req: Request<{}, {}, userExistanceType>,
	res: Response,
	next: NextFunction
) {
	const { userName } = req.body;

	const currentUser = await UserModel.findOne({ userName: userName });

	if (currentUser) {
		return res.status(400).json({
			status: 'fail',
			message: '💥 Username exist',
		});
	} else {
		return res.status(200).json({
			status: 'success',
			message: 'Username available',
		});
	}
});


export {
	checkUserExistance,
	signup,
	login
};