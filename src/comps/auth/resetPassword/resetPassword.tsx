// ResetPasswordPage.tsx
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  IconUserCircle,
  IconUser,
  IconLock,
  IconArrowLeft,
  IconCheck,
  IconMail
} from '@tabler/icons-react';

import { useMediaQuery } from "@/comps/public/useMediaQuery"
import { useNotification } from "@/comps/noti/notiComp"
import OTPInput from '@/comps/auth/resetPassword/otpComp'

import { sendOTP, verifyOTP } from '@/utils/auth/authAPI';
import { resetPassword } from '@/utils/api/userData';


const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  const { showNotification } = useNotification();
  const router = useRouter();

  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleEmailSubmit = async () => {
    setLoading(true);

    try {
      console.log('Sending OTP to:', email);

      const otpData = await sendOTP({ email });

      if (otpData.success) {
        showNotification("OTP Sent", `${otpData.message}`, "success");
        setStep(2);
      } else {
        showNotification("Error", `${otpData.message}`, "error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showNotification("Error", "An error occurred while sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = (verified: boolean, token?: string) => {
    setVerificationResult(verified);
    console.log(`Verification ${verified ? 'successful' : 'failed'} for ${email}`);
    
    if (verified && token) {
      setToken(token);
      showNotification("Success", "OTP verified successfully", "success");
      setStep(3);
    } else if (!verified) {
      showNotification("Failed", "Invalid OTP", "error");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showNotification("Error", "Passwords do not match", "error");
      return;
    }
    
    if (password.length < 8) {
      showNotification("Error", "Password must be at least 8 characters long", "error");
      return;
    }
    
    setLoading(true);

    try {
      const resetData = await resetPassword({ email, password });

      if (resetData.success) {
        showNotification("Success", "Password reset successfully", "success");
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      } else {
        showNotification("Error", `${resetData.message}`, "error");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      showNotification("Error", "An error occurred while resetting password", "error");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isLargerThanSm = useMediaQuery("(min-width: 768px)");

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 relative overflow-hidden">
      {/* Background pattern */}
      {isLargerThanSm ? (
        <>
          <div className="absolute right-0 h-[120%] w-[90%] opacity-95 z-0 -top-48"
            style={{
              transform: 'translateX(30%)'
            }}>
            <Image src="/clevDT.png" alt="clev" width={1000} height={1000} className="w-full h-[130%] rotate-3" />
          </div>

          <div className="absolute -right-20 h-[120%] w-[90%] opacity-55 z-0 top-32"
            style={{
              transform: 'translateX(30%)'
            }}>
            <Image src="/clevDT.png" alt="clev" width={1000} height={1000} className="w-full h-[130%]" />
          </div>

          <div className="absolute -right-10 h-[120%] w-[90%] opacity-35 z-0 top-0"
            style={{
              transform: 'translateX(30%)'
            }}>
            <Image src="/clevDT.png" alt="clev" width={1000} height={1000} className="w-full h-[130%]" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute right-0 h-[110%] w-[200%] opacity-95 z-0 top-0"
            style={{
              transform: 'translateX(20%)',
            }}>
            <Image src="/clevDT.png" alt="clev" width={1000} height={1000} className="w-[120%] h-[120%] rotate-90" />
          </div>

          <div className="absolute right-0 h-[110%] w-[150%] opacity-55 z-0 top-0"
            style={{
              transform: 'translateX(-10%)'
            }}>
            <Image src="/clevDT.png" alt="clev" width={1000} height={1000} className="w-[120%] h-[100%] rotate-90" />
          </div>

          <div className="absolute right-0 h-[110%] w-[160%] opacity-35 z-0 top-0"
            style={{
              transform: 'translateX(30%)'
            }}>
            <Image src="/clevDT.png" alt="clev" width={1000} height={1000} className="w-[120%] h-[100%] rotate-90" />
          </div>
        </>
      )}

      {/* Content Container */}
      <div className={`flex flex-col justify-center w-full z-10 ${isLargerThanSm ? 'items-end' : 'items-center'}`}>
        <div className={`flex flex-col w-full max-w-md p-8 rounded-lg ${isLargerThanSm ? 'mr-[18%]' : 'mr-0'}`}>
          
          {/* Header with back button */}
          <div className="flex items-center mb-4">
            {step > 1 && (
              <button 
                onClick={goBack}
                className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
              >
                <IconArrowLeft size={20} />
                <span className="ml-1">Back</span>
              </button>
            )}
            <h1 className="text-2xl font-bold text-center flex-grow text-[#000000]">Reset Password</h1>
          </div>

          {renderStepIndicator()}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">Enter your email address and we'll send you an OTP to reset your password.</p>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconMail size={20} className="text-teal-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
              </div>

              {loading ? (
                <button
                  disabled
                  className="w-full bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    handleEmailSubmit()
                  }}
                >
                  Send OTP
                </button>
              )}
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <p className="text-gray-600 mb-6">We've sent a verification code to <span className="font-semibold">{email}</span>. Please enter it below.</p>
              
              <OTPInput
                email={email}
                verifyOTP={async ({ email, otp }) => {
                  const result = await verifyOTP({ email, otp });
                  if (result.success){
                    showNotification("Success", "OTP verify!", "success")
                    setStep(3);
                  } else {
                    showNotification("OTP Invalid", "OTP Invalid!", "error")
                  }
                  return result;
                }}
                resendOTP={async ({ email }) => {
                  const result = await sendOTP({ email });
                  return result;
                }}
                token=""
                rememberMe={false}
                onVerificationComplete={(verified, token) => handleOTPVerification(verified, token)}
              />

              {verificationResult === false && (
                <div className="mt-4 p-3 rounded-md text-center bg-red-50 text-red-700 border border-red-200">
                  Verification failed. Please try again.
                </div>
              )}
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <p className="text-gray-600 mb-4">Create a new password for your account.</p>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconLock size={20} className="text-teal-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>

              <div className="mb-6">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-black mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconCheck size={20} className="text-teal-500" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 block w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 text-black ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {loading ? (
                <button
                  disabled
                  className="w-full bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Resetting...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={!password || password !== confirmPassword}
                >
                  Reset Password
                </button>
              )}
            </form>
          )}

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;