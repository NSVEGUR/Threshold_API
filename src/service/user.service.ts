import user from '../util/userType.util';
import { NextFunction } from 'express';
import { userType } from '../schema/user.schema';
import AppError from '../util/appError.util';

export default async function createUser(data: userType, next: NextFunction) {
	const User = user(data.role);
	if (!User)
		return next(new AppError('Please provide a Valid role among student, teacher, or admin', 401));;
	const details = {
		userName: data.userName,
		mobile: data.mobile,
		password: data.password
	}
	return await User.create(details);
}

