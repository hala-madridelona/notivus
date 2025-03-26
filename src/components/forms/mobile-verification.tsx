'use client';

import { sendOtp, verifyOtp } from '@/server/auth/otp';
import { Send } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export const MobileVerificationForm = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [pageView, setPageView] = useState<
    'send-otp' | 'verify-otp' | 'otp-verified' | 'success' | 'error'
  >('send-otp');
  const [otp, setOtp] = useState('');

  const handleOtpSend = async () => {
    try {
      await sendOtp(mobileNumber);
      setPageView('verify-otp');
    } catch (error) {
      console.error('Error in handleOtpSend', error);
    }
  };

  const handleOtpVerify = async () => {
    try {
      const response = await verifyOtp(mobileNumber, otp);
      if (response.status === 'approved') {
        setPageView('otp-verified');
        await signIn('mobile-otp', {
          mobileNumber,
        });
        setPageView('success');
      }
    } catch (error) {
      console.error('Error in handleOtpVerify', error);
    }
  };

  if (pageView === 'error') {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }

  if (pageView === 'success') {
    return (
      <div>
        <h1>Success</h1>
      </div>
    );
  }

  if (pageView === 'otp-verified') {
    return (
      <div>
        <h1>OTP verified successfully. Signing in...</h1>
      </div>
    );
  }

  if (pageView === 'send-otp') {
    return (
      <form>
        <div className="flex flex-col items-center gap-2 w-[300px]">
          <div className="flex flex-1 gap-1">
            <span className="border border-gray-300 rounded-md px-2 py-1">+91</span>
            <input
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
              type="text"
              placeholder="Enter your mobile number"
              pattern="^[6-9]\d{9}$"
              maxLength={10}
              minLength={10}
            />
          </div>
          <button
            type="button"
            onClick={handleOtpSend}
            className="flex flex-1 gap-2 bg-blue-900 text-white rounded-md px-21 py-2"
          >
            Send OTP
            <Send />
          </button>
        </div>
      </form>
    );
  }

  if (pageView === 'verify-otp') {
    return (
      <form>
        <div className="flex flex-col items-center gap-2 w-[300px]">
          <div className="flex flex-1 gap-1">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
            />
          </div>
          <button
            type="button"
            onClick={handleOtpVerify}
            className="flex flex-1 gap-2 bg-blue-900 text-white rounded-md px-21 py-2"
          >
            Verify OTP
            <Send />
          </button>
        </div>
      </form>
    );
  }
};
