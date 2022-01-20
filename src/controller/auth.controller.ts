import { Request, Response, NextFunction } from 'express';
import config from './../config';
import { userType } from '../schema/user.schema';
import { loginType } from '../schema/login.schema';
import user from '../util/userType.util';
import catchAsync from '../util/catchAsync.util';
import createUser from '../service/user.service';
import AppError from '../util/appError.util';

const signup = catchAsync(async function (
	req: Request<{}, {}, userType>,
	res: Response,
	next: NextFunction
) {
	const newUser: any = await createUser(req.body, next);
	newUser.password = undefined;
	if (config.NODE_ENV == 'development')
		return res.status(201).json({
			status: 'success',
			message: 'user created successfully',
			data: {
				newUser
			}
		});
	else {
		//Call Next function (Send OTP) in the middleware if User is created successfully
		next();
	};
});

const login = catchAsync(async function (
	req: Request<{}, {}, loginType>,
	res: Response,
	next: NextFunction
) {
	const { userName, role, password } = req.body;
	const User = user(role);

	//1) Don't make any sense but to just avoid ts error
	if (!User)
		return next(new AppError('Please provide a Valid role among student, teacher, or admin', 401));

	//2) Check user exist and password is correct
	const currentUser: any = await User.findOne({ userName: userName }).select('+password');
	if (!currentUser || !await currentUser.correctPassword(password, currentUser.password)) {
		return next(new AppError('Incorrect User Name or Password', 404));
	}

	currentUser.password = undefined;

	if (config.NODE_ENV == 'development')
		return res.status(201).json({
			status: 'success',
			message: 'loggedInSuccessfully',
			data: {
				currentUser
			}
		});
	else {
		//Call Next function (Send OTP) in the middleware if User is created successfully
		next();
	};
});

export {
	signup,
	login
};