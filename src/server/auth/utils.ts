'use server';

import { sendVerificationCode, verifyPhoneNumber } from '../network/partners/twilio';

export const verifyOtp = async (phoneNumber: string, otp: string) =>
  verifyPhoneNumber(phoneNumber, otp);

export const sendOtp = async (phoneNumber: string) => sendVerificationCode(phoneNumber);
