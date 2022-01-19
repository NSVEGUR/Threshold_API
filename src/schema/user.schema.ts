import { object, string, TypeOf } from 'zod';
import validator from 'validator';

const roles: string[] = ['student', 'teacher', 'admin'];

export const userSchema = object({
	body: object({
		userName: string({
			required_error: "Please provide a user name to create your account "
		}).min(5, 'UserName is too short, minimum 5 characters is required'),
		mobile: string({
			required_error: "Mobile number is required for two factor authentication"
		}),
		password: string({
			required_error: "Please provide a password"
		}).min(8, 'Password is too short, minimum 8 characters is required'),
		passwordConfirm: string({
			required_error: "Kindly Confirm your password"
		}),
		mobileConfirm: string({
			required_error: "Kindly Confirm your mobile number"
		}),
		role: string({
			required_error: "Please Provide a role for the user"
		})
	}).refine((data) => data.password == data.passwordConfirm, {
		message: "Passwords do not match",
		path: ['passwordConfirm']
	}).refine((data) => data.mobile == data.mobileConfirm, {
		message: "Mobile numbers do not match",
		path: ['mobileConfirm']
	}).refine((data) => validator.isMobilePhone(data.mobile), {
		message: "Please provide a valid mobile number"
	}).refine((data) => roles.includes(data.role), {
		message: "Please provide a valid user among student, teacher and admin"
	})
})

export type userType = TypeOf<typeof userSchema>['body'];