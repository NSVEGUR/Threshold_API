import { object, string, TypeOf } from 'zod';
import validator from 'validator';

const roles: string[] = ['student', 'teacher', 'admin'];

export const otpSchema = object({
	body: object({
		userName: string({
			required_error: "Please provide username to validate otp"
		}),
		otp: string({
			required_error: "Please provide OTP to verify"
		}),
		mobile: string({
			required_error: "Please provide mobile number"
		}),
		role: string({
			required_error: "Please provide a role"
		})
	}).refine((data) => validator.isMobilePhone(data.mobile), {
		message: "Please provide a valid mobile number"
	}).refine((data) => roles.includes(data.role), {
		message: "Please provide a valid user among student, teacher and admin"
	})
});

export type otpType = TypeOf<typeof otpSchema>['body'];