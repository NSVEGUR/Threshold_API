import { NextFunction } from 'express';
import { otpType } from '../schema/otp.schema';
import { AnyZodObject } from 'zod';
import AppError from './appError.util';

const validateOtpResource = (schema: AnyZodObject, data: otpType, next: NextFunction) => {
	try {
		schema.parse({
			body: data
		});
	} catch (err: any) {
		const { issues } = err;
		const message = issues[0].message;
		return next(new AppError(message, 400));
	}
};

export default validateOtpResource;