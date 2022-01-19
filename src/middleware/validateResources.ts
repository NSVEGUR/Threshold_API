import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import AppError from '../util/appError.util';
import catchAsync from '../util/catchAsync.util';

const validateResource = (schema: AnyZodObject) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params
		});
	} catch (err: any) {
		const { issues } = err;
		const message = issues[0].message;
		return next(new AppError(message, 400));
	}
	next();
});

export default validateResource;