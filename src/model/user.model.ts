import { prop, pre, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';


@pre<User>('save', async function (next) {
	if (!this.isModified('password')) {
		return;
	}
	if (!this.isModified('mobile')) {
		return;
	}

	// Hashing password & mobile number at the rate of 12
	this.password = await bcrypt.hash(this.password, 12);
	this.mobile = await bcrypt.hash(this.mobile, 12);

	next();
})

export class User {
	[x: string]: any;

	//PROPERTIES
	@prop({ required: true, unique: true, lowercase: true })
	userName: string;

	@prop({ required: true, select: false })
	mobile: string;

	@prop({ required: true, select: false })
	password: string;

	photo: string;
	mobileChangedAt: any;
	passwordChangedAt: any;

	//METHODS
	//To compare the encrypted password
	async correctPassword(candidatePassword: string, userPassword: string) {
		return await bcrypt.compare(candidatePassword, userPassword);
	}
	//To compare the encrypted mobile number
	async correctMobile(candidateMobile: string, userMobile: string) {
		return await bcrypt.compare(candidateMobile, userMobile);
	}
	//To provide a jwt token
	signToken(this: User, role: string) {
		return jwt.sign({
			_id: this._id,
			role
		}, config.get('jwtSecret'), {
			expiresIn: config.get('jwtExpiresIn')
		});
	}
	//to check if the password is changed after issuing jwt token
	changedPasswordAfter(this: User, JWTTimeStamp: number) {
		if (this.passwordChangedAt) {
			const changedTimeStamp = parseInt(
				`${this.passwordChangedAt.getTimeStamp() / 1000}`,
				10
			);
			return JWTTimeStamp < changedTimeStamp; //If user Changed the password after issueing the JWT Token
		}
		return false;
	}
	//to check if the mobile number is changed after issuing jwt token
	changedMobileAfter(this: User, JWTTimeStamp: number) {
		if (this.mobileChangedAt) {
			const changedTimeStamp = parseInt(
				`${this.mobileChangedAt.getTimeStamp() / 1000}`,
				10
			);
			return JWTTimeStamp < changedTimeStamp; //If user Changed the mobile after issueing the JWT Token
		}
		return false;
	}
}

export const UserModel = getModelForClass(User);
export const Student = UserModel.discriminator('student', new mongoose.Schema({}));
export const Teacher = UserModel.discriminator('teacher', new mongoose.Schema({}));
export const Admin = UserModel.discriminator('admin', new mongoose.Schema({}));