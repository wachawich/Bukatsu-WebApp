import { useState } from 'react';

import { verifyOTP, sendOTP } from '@/utils/auth/authAPI';
import { useRouter } from 'next/router';
import { useNotification } from "@/comps/noti/notiComp"

interface OTPInputProps {
    email: string;
    onVerificationComplete: (verified: boolean) => void;
    verifyOTP: (params: { email: string; otp: string }) => Promise<{ success: boolean; message?: string }>;
    resendOTP: (params: { email: string }) => Promise<{ success: boolean; message?: string }>;
    token?: any;
}



const OTPInput = ({ email, onVerificationComplete, token }: OTPInputProps) => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);
    const inputRefs = Array(6).fill(0).map(() => useState<HTMLInputElement | null>(null));

    const router = useRouter();
    const { showNotification } = useNotification();
    

    const focusInput = (index: number): void => {
        if (inputRefs[index][0]) {
            inputRefs[index][0]?.focus();
        }
    };

    const handleChange = (index: number, value: string): void => {
        // Only allow numbers
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if current input is filled
        if (value && index < 5) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        // Move to previous input if backspace is pressed and current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            focusInput(index - 1);
        }

        // Move focus when using arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        }
        if (e.key === 'ArrowRight' && index < 5) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedOtp = pastedData.slice(0, 6).split('');

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedOtp.length, 6); i++) {
            if (/^\d$/.test(pastedOtp[i])) {
                newOtp[i] = pastedOtp[i];
            }
        }
        setOtp(newOtp);

        // Focus the next empty input or the last input
        for (let i = 0; i < 6; i++) {
            if (!newOtp[i]) {
                focusInput(i);
                break;
            }
            if (i === 5) {
                focusInput(5);
            }
        }
    };

    const resetOTP = (): void => {
        setOtp(Array(6).fill(''));
        setError('');
        setIsVerified(false);
        setIsVerifying(false);
        setTimeout(() => focusInput(0), 0);
    };

    const startResendTimer = (): void => {
        setTimeLeft(30);
        setCanResend(false);

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const handleVerify = async (): Promise<void> => {
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setError('');
        setIsVerifying(true);

        try {
            const result = await verifyOTP({ email, otp: otpValue });
            setIsVerifying(false);
            setIsVerified(result.success);
            if (!result.success) setError(result.message || 'Verification failed');
            onVerificationComplete(result.success);

            if (result.success) {
                const expiresInDays = 1;
                const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000; // milliseconds

                const data = {
                    token,
                    expiresAt
                };
                localStorage.setItem("bukatsu_access_token", JSON.stringify(data));
                console.log("set bukatsu_access_token : ", data)

                showNotification("Verified", "OTP ถูกต้อง กำลัง Login....", "success");
                router.push('/home');
            }
        } catch (err) {
            setIsVerifying(false);
            setError('Verification error');
        }
    };


    const handleResend = async (): Promise<void> => {
        resetOTP();
        startResendTimer();

        try {
            const result = await sendOTP({ email });
            if (!result.success) {
                setError(result.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Resend error');
        }
    };
    ;

    // Start timer on first load
    useState(() => {
        startResendTimer();
        // Focus the first input on mount
        setTimeout(() => focusInput(0), 0);
    });

    return (
        <>
            <p className="text-center text-gray-600 mb-6">
                ตอนนี้เราได้ส่ง OTP ไปทาง <span className="font-semibold">{email}</span>
            </p>

            <div className="flex justify-between mb-8">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => inputRefs[index][1](el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-14 text-center text-black text-xl font-bold border-2 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                        disabled={isVerifying || isVerified}
                    />
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            <button
                onClick={handleVerify}
                disabled={otp.join('').length !== 6 || isVerifying || isVerified}
                className={`py-3 rounded-md font-medium transition-colors ${otp.join('').length === 6 && !isVerifying && !isVerified
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isVerifying ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                    </span>
                ) : isVerified ? (
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Verified
                    </span>
                ) : (
                    'Verify'
                )}
            </button>

            <div className="mt-6 text-center">
                <span className="text-gray-600">Didn't receive the code? </span>
                {canResend ? (
                    <button
                        onClick={handleResend}
                        className="text-blue-600 font-medium hover:text-blue-800 focus:outline-none"
                        disabled={isVerifying}
                    >
                        Resend
                    </button>
                ) : (
                    <span className="text-gray-400">Resend in {timeLeft}s</span>
                )}
            </div>
        </>
    );
}

export default OTPInput;