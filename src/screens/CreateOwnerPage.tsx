import { useState } from 'react';
import { ChevronRight, Eye, EyeOff, CheckCircle2, XCircle, User, Mail, Phone, Lock, Shield } from 'lucide-react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';

interface CreateOwnerPageProps {
  onCancel: () => void;
  onSuccess: () => void;
  onNavigateDashboard: () => void;
  onNavigateOwners: () => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

function getPasswordStrength(pwd: string): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string } {
  if (!pwd) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { level: 1 as const, label: 'Weak', color: 'bg-red-400' },
    { level: 2 as const, label: 'Fair', color: 'bg-amber-400' },
    { level: 3 as const, label: 'Good', color: 'bg-sky-400' },
    { level: 4 as const, label: 'Strong', color: 'bg-emerald-500' },
  ];
  return map[Math.max(0, score - 1)];
}

const ROLE_OPTIONS = [{ value: 'boarding_owner', label: 'Boarding Owner' }];

export default function CreateOwnerPage({
  onCancel,
  onSuccess,
  onNavigateDashboard,
  onNavigateOwners,
}: CreateOwnerPageProps) {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  function set(field: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!values.name.trim()) {
      e.name = 'Full name is required';
    } else if (values.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters';
    }
    if (!values.email.trim()) {
      e.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!values.password) {
      e.password = 'Password is required';
    } else if (values.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (!values.phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phone.trim())) {
      e.phone = 'Enter a valid 10-digit phone number';
    }
    if (!values.role) {
      e.role = 'Please select a role';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    // Simulate API call — replace with real call later
    setTimeout(() => {
      // Mock success
      setStatus('success');
      setStatusMsg('Owner created successfully! They will receive an email to verify their account.');
      setTimeout(() => onSuccess(), 2000);
    }, 1600);
  }

  const strength = getPasswordStrength(values.password);

  return (
    <div className="screen-enter space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2" aria-label="Breadcrumb">
            <button
              onClick={onNavigateDashboard}
              className="hover:text-sky-500 transition-colors focus:outline-none focus-visible:underline"
            >
              Dashboard
            </button>
            <ChevronRight size={12} className="text-slate-300" />
            <button
              onClick={onNavigateOwners}
              className="hover:text-sky-500 transition-colors focus:outline-none focus-visible:underline"
            >
              Manage Pet Owner
            </button>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-600 font-medium">Create Owner</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Create Owner</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a new boarding owner to the platform.</p>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={status === 'loading' || status === 'success'}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-owner-form"
            loading={status === 'loading'}
            disabled={status === 'success'}
          >
            {status === 'loading' ? 'Creating…' : 'Save Owner'}
          </Button>
        </div>
      </div>

      {/* Status banners */}
      {status === 'success' && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3.5 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Owner created successfully!</p>
            <p className="text-xs text-emerald-600 mt-0.5">{statusMsg}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3.5 animate-fade-in">
          <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Failed to create owner</p>
            <p className="text-xs text-red-600 mt-0.5">{statusMsg || 'Please try again or contact support.'}</p>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Owner Information</h2>
        </div>

        <form id="create-owner-form" onSubmit={handleSubmit} noValidate className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">

            {/* Full Name — full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Full Name"
                id="name"
                type="text"
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                error={errors.name}
                hint="Enter first and last name"
                required
                autoComplete="name"
                leftIcon={<User size={15} />}
                maxLength={80}
              />
            </div>

            {/* Email */}
            <FormField
              label="Email Address"
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              hint="A verification link will be sent here"
              required
              autoComplete="email"
              leftIcon={<Mail size={15} />}
            />

            {/* Phone */}
            <FormField
              label="Phone Number"
              id="phone"
              type="tel"
              inputMode="numeric"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={errors.phone}
              hint="10-digit mobile number"
              required
              autoComplete="tel"
              leftIcon={<Phone size={15} />}
            />

            {/* Password — full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={(e) => set('password', e.target.value)}
                error={errors.password}
                required
                autoComplete="new-password"
                leftIcon={<Lock size={15} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Password strength bar */}
              {values.password && (
                <div className="mt-1 mb-2 px-1 space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          seg <= strength.level ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                    <span
                      className={`text-[11px] font-semibold ml-1 w-12 ${
                        strength.level >= 3
                          ? 'text-emerald-600'
                          : strength.level === 2
                          ? 'text-sky-500'
                          : strength.level === 1
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Use 8+ characters with a mix of letters, numbers and symbols for a strong password.
                  </p>
                </div>
              )}
            </div>

            {/* Role */}
            <div className="sm:col-span-2 sm:max-w-[50%]">
              <SelectField
                label="Role"
                id="role"
                value={values.role}
                onChange={(e) => set('role', e.target.value)}
                options={ROLE_OPTIONS}
                error={errors.role}
                hint="Select the owner's access role"
                required
              />
            </div>
          </div>

          {/* Payload preview hint */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-start gap-2.5 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200/60">
              <Shield size={15} className="text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                The owner will receive a verification email upon creation. Their account will be active
                after email confirmation. Required fields are marked with{' '}
                <span className="text-red-400 font-medium">*</span>.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom action bar (mobile-friendly sticky) */}
      <div className="flex items-center justify-end gap-3 py-2">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={status === 'loading' || status === 'success'}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-owner-form"
          loading={status === 'loading'}
          disabled={status === 'success'}
        >
          {status === 'loading' ? 'Creating…' : 'Save Owner'}
        </Button>
      </div>
    </div>
  );
}
