import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import InputField from '../components/InputField';

interface AdminLoginProps {
  onSendOTP: (email: string) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function AdminLogin({ onSendOTP }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate network delay — replace with real API call later
    setTimeout(() => {
      setLoading(false);
      onSendOTP(email);
    }, 1400);
  }

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
          {/* Logo */}
          <div className="mb-8">
            <Logo size="lg" />
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Admin Login
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your admin credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              id="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<Mail size={16} />}
            />

            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              leftIcon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            {/* Forgot password placeholder */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors focus:outline-none focus-visible:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" loading={loading} fullWidth className="mt-1">
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </Button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Protected by multi-factor authentication
          </p>
        </div>

        {/* Bottom badge */}
        <p className="mt-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AdminPanel. All rights reserved.
        </p>
      </div>
    </div>
  );
}
