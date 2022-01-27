import express from 'express';
import validateResource from '../middleware/validateResources';
import { userSchema } from '../schema/user.schema';
import { loginSchema } from '../schema/login.schema';
import { otpSchema } from '../schema/otp.schema';
import { signup, login, checkUserExistance } from '../controller/auth.controller';
import { sendOtp, verifyOtp } from '../controller/otp.controller';

const router = express.Router();

router.post('/signup', validateResource(userSchema), signup, sendOtp);
router.post('/login', validateResource(loginSchema), login, sendOtp);
router.post('/checkUserExistance', checkUserExistance);
router.post('/verify', validateResource(otpSchema), verifyOtp);

export default router;