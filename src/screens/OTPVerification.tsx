import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

type StatusType = 'idle' | 'success' | 'error';

export default function OTPVerification({ email, onBack, onVerified }: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<StatusType>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(RESEND_COUNTDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startCountdown]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setStatus('idle');
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split('').forEach((ch, i) => {
      if (i < OTP_LENGTH) newOtp[i] = ch;
    });
    setOtp(newOtp);
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setStatus('error');
      setStatusMsg('Please enter all 6 digits of the OTP');
      return;
    }
    setVerifying(true);
    setStatus('idle');
    // Simulate verification — replace with real API call later
    setTimeout(() => {
      setVerifying(false);
      // For UI demo: any complete OTP succeeds
      setStatus('success');
      setStatusMsg('OTP verified successfully! Redirecting…');
      setTimeout(() => onVerified(), 1200);
    }, 1500);
  }

  function handleResend() {
    if (countdown > 0 || resending) return;
    setResending(true);
    setOtp(Array(OTP_LENGTH).fill(''));
    setStatus('idle');
    inputRefs.current[0]?.focus();
    setTimeout(() => {
      setResending(false);
      setStatus('idle');
      setStatusMsg('');
      startCountdown();
    }, 1000);
  }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
  const isComplete = otp.every((d) => d !== '');

  return (
    <div className="screen-enter min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-200/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-7 group focus:outline-none focus-visible:underline"
            aria-label="Go back to login"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Back to login
          </button>

          {/* Logo */}
          <div className="mb-8">
            <Logo size="lg" />
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Verify OTP
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter the 6-digit OTP sent to your email
            </p>
            <p className="mt-1 text-sm font-medium text-sky-600 truncate">{maskedEmail}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerify} noValidate>
            {/* OTP Boxes */}
            <div
              className="flex items-center justify-between gap-2 sm:gap-3 mb-6"
              onPaste={handlePaste}
              role="group"
              aria-label="OTP input"
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`OTP digit ${i + 1}`}
                  className={`
                    w-full aspect-square max-w-[52px] sm:max-w-[56px] text-center text-xl font-bold rounded-xl border-2
                    transition-all duration-200 outline-none caret-transparent
                    ${digit ? 'text-slate-900' : 'text-slate-300'}
                    ${
                      status === 'error'
                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : status === 'success'
                        ? 'border-emerald-400 bg-emerald-50'
                        : digit
                        ? 'border-sky-400 bg-sky-50/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                        : 'border-slate-200 bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                    }
                  `}
                />
              ))}
            </div>

            {/* Status messages */}
            {status !== 'idle' && (
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm font-medium animate-fade-in
                  ${status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
                role="alert"
              >
                {status === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <XCircle size={16} className="shrink-0" />
                )}
                {statusMsg}
              </div>
            )}

            <Button
              type="submit"
              loading={verifying}
              fullWidth
              disabled={!isComplete || status === 'success'}
            >
              {verifying ? 'Verifying…' : 'Verify OTP'}
            </Button>
          </form>

          {/* Resend row */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">Didn't receive the code?</span>
            {countdown > 0 ? (
              <span className="text-sm text-slate-400 tabular-nums">
                Resend in{' '}
                <span className="font-semibold text-sky-500">
                  0:{String(countdown).padStart(2, '0')}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors disabled:opacity-60 focus:outline-none focus-visible:underline"
              >
                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Resending…' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>

        {/* Bottom badge */}
        <p className="mt-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AdminPanel. All rights reserved.
        </p>
      </div>
    </div>
  );
}
