import { useState } from 'react';
import { Settings, Eye, EyeOff, Save, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function PaymentSettings() {
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');
  const [gstPercentage, setGstPercentage] = useState('18');
  const [advanceAmount, setAdvanceAmount] = useState('500');
  const [currency, setCurrency] = useState('INR');
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!keyId.trim()) e.keyId = 'Razorpay Key ID is required';
    if (!keySecret.trim()) e.keySecret = 'Razorpay Key Secret is required';
    if (!gstPercentage.trim() || isNaN(Number(gstPercentage)) || Number(gstPercentage) < 0)
      e.gstPercentage = 'Enter a valid GST percentage';
    if (!advanceAmount.trim() || isNaN(Number(advanceAmount)) || Number(advanceAmount) < 0)
      e.advanceAmount = 'Enter a valid advance amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  }

  function handleReset() {
    setKeyId('');
    setKeySecret('');
    setGstPercentage('18');
    setAdvanceAmount('500');
    setCurrency('INR');
    setErrors({});
    setSaved(false);
  }

  const inputBase =
    'w-full h-10 px-4 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <span className="text-sky-500"><Settings size={16} /></span>
        <h3 className="text-sm font-semibold text-slate-700">Payment Settings</h3>
      </div>

      <form onSubmit={handleSave} noValidate className="p-5 space-y-5">
        {/* Security warning */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <ShieldAlert size={15} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Razorpay credentials are sensitive. Do not share them publicly. Ensure you are using the correct
            environment keys (test/live) for your deployment.
          </p>
        </div>

        {/* Success message */}
        {saved && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-fade-in">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700">Settings saved successfully.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {/* Razorpay Key ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Razorpay Key ID</label>
            <input
              type="text"
              value={keyId}
              onChange={(e) => { setKeyId(e.target.value); if (errors.keyId) setErrors((p) => ({ ...p, keyId: '' })); }}
              placeholder="rzp_test_xxxxxxxx"
              className={`${inputBase} ${errors.keyId ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`}
            />
            {errors.keyId && <p className="text-[11px] text-red-500">{errors.keyId}</p>}
          </div>

          {/* Razorpay Key Secret */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Razorpay Key Secret</label>
            <div className="relative flex items-center">
              <input
                type={showSecret ? 'text' : 'password'}
                value={keySecret}
                onChange={(e) => { setKeySecret(e.target.value); if (errors.keySecret) setErrors((p) => ({ ...p, keySecret: '' })); }}
                placeholder="••••••••••••"
                className={`w-full h-10 px-4 pr-12 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none ${errors.keySecret ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`}
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                aria-label={showSecret ? 'Hide secret' : 'Show secret'}
              >
                {showSecret ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.keySecret && <p className="text-[11px] text-red-500">{errors.keySecret}</p>}
          </div>

          {/* GST Percentage */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">GST Percentage</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={gstPercentage}
                onChange={(e) => { setGstPercentage(e.target.value); if (errors.gstPercentage) setErrors((p) => ({ ...p, gstPercentage: '' })); }}
                placeholder="18"
                className={`${inputBase} ${errors.gstPercentage ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`}
              />
              <span className="absolute right-3 text-slate-400 text-sm">%</span>
            </div>
            {errors.gstPercentage && <p className="text-[11px] text-red-500">{errors.gstPercentage}</p>}
          </div>

          {/* Fixed Advance Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Fixed Advance Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 text-sm">₹</span>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => { setAdvanceAmount(e.target.value); if (errors.advanceAmount) setErrors((p) => ({ ...p, advanceAmount: '' })); }}
                placeholder="500"
                className={`w-full h-10 pl-8 pr-4 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none ${errors.advanceAmount ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`}
              />
            </div>
            {errors.advanceAmount && <p className="text-[11px] text-red-500">{errors.advanceAmount}</p>}
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={15} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
