'use server';

import axios from 'axios';

export const verifyPhoneNumber = async (phoneNumber: string, code: string) => {
  const url = `${process.env.TWILIO_BASE_URL}/${process.env.TWILIO_SERVICE_SID}/VerificationCheck`;
  const params = new URLSearchParams();
  params.append('To', `+91${phoneNumber}`);
  params.append('Code', code);
  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID as string,
        password: process.env.TWILIO_AUTH_TOKEN as string,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in verifyPhoneNumber', error);
    throw error;
  }
};

export const sendVerificationCode = async (phoneNumber: string) => {
  const url = `${process.env.TWILIO_BASE_URL}/${process.env.TWILIO_SERVICE_SID}/Verifications`;
  const params = new URLSearchParams();
  params.append('To', `+91${phoneNumber}`);
  params.append('Channel', 'sms');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  };

  try {
    const response = await axios.post(url, params, {
      headers,
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID as string,
        password: process.env.TWILIO_AUTH_TOKEN as string,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in sendVerificationCode', error);
    throw error;
  }
};
