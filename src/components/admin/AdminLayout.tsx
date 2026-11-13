import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Images,
  ShoppingBag,
  Truck,
  Activity,
  Settings,
  LogOut,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  Users,
  AlertCircle,
  Check,
  Copy,
  Download,
  AlertTriangle,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminBanners } from './AdminBanners';
import { AdminOrders } from './AdminOrders';
import { AdminCourier } from './AdminCourier';
import { AdminPixel } from './AdminPixel';
import { AdminSettings } from './AdminSettings';
import { AdminUsers } from './AdminUsers';

// ============================================================
// 🔑 Recovery Code Generator
// ============================================================
const generateRecoveryCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars (0/O, 1/I/L)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const code = Array.from(array).map((b) => chars[b % chars.length]).join('');
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
};

// ============================================================
// 🔒 Password Strength Bar
// ============================================================
const PasswordStrengthBar: React.FC<{ pwd: string }> = ({ pwd }) => {
  if (pwd.length === 0) return null;
  const getLevel = (p: string) => {
    if (p.length < 6) return 1;
    if (p.length < 8) return 2;
    if (p.length < 12) return 3;
    return 4;
  };
  const level = getLevel(pwd);
  const labels = ['', 'খুব দুর্বল', 'দুর্বল', 'ভালো', 'শক্তিশালী'];
  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-700'];
  const textColors = ['', 'text-rose-600', 'text-amber-600', 'text-emerald-700', 'text-emerald-800'];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= level ? colors[level] : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-stone-500">শক্তি:</span>
        <span className={`text-[10px] font-bold ${textColors[level]}`}>{labels[level]}</span>
      </div>
    </div>
  );
};

// ============================================================
// 📋 Recovery Code Display Screen
// ============================================================
const RecoveryCodeDisplayScreen: React.FC<{
  code: string;
  confirmed: boolean;
  onConfirmChange: (c: boolean) => void;
  onContinue: () => void;
  isReset?: boolean;
}> = ({ code, confirmed, onConfirmChange, onContinue, isReset }) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`রিকভারি কোড: ${code}`);
    }
  };

  const handleDownload = () => {
    const content =
      `FoodGhor Admin Recovery Code\n` +
      `===============================\n\n` +
      `Code: ${code}\n\n` +
      `Keep this code safe. You will need this if you forget your admin password.\n` +
      `Generated: ${new Date().toLocaleString()}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodghor-recovery-code-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-lg border border-amber-300">
            <Key className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-stone-900 font-serif">
            {isReset ? 'আপনার নতুন রিকভারি কোড' : 'আপনার রিকভারি কোড'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            পাসওয়ার্ড ভুলে গেলে এই কোড দিয়ে পাসওয়ার্ড রিসেট করবেন
          </p>
        </div>

        <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300">
          <div className="text-center text-[11px] font-bold text-amber-900 mb-2 uppercase tracking-wider">
            🔐 আপনার রিকভারি কোড
          </div>
          <div className="text-center text-lg sm:text-2xl font-mono font-black text-amber-950 tracking-wider break-all select-all">
            {code}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleCopy}
            className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? 'ডাউনলোড হয়েছে!' : 'ডাউনলোড'}</span>
          </button>
        </div>

        <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-xl text-[11px] text-rose-900 font-medium mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="block mb-0.5">⚠️ এই কোড শুধু একবারই দেখা যাবে!</strong>
              <span>
                এখনই লিখে রাখুন বা ডাউনলোড করুন। কোড ছাড়া পাসওয়ার্ড ভুলে গেলে অ্যাকাউন্ট রিকভার
                করা যাবে না।
              </span>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-emerald-800 rounded shrink-0 cursor-pointer"
          />
          <span className="text-xs font-semibold text-stone-800">
            আমি এই রিকভারি কোড সংরক্ষণ করেছি এবং কোথায় রাখছি তা জানি
          </span>
        </label>

        <button
          onClick={onContinue}
          disabled={!confirmed}
          className={`w-full py-3.5 px-4 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
            confirmed
              ? 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer'
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>কোড সেভ করেছি — চালিয়ে যান</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================
// 📌 Auth Mode Type
// ============================================================
type AuthMode =
  | 'login'
  | 'setup'
  | 'setup-recovery-show'
  | 'forgot-enter-code'
  | 'forgot-new-password'
  | 'forgot-new-recovery-show';

// ============================================================
// 🎯 Main Component
// ============================================================
export const AdminLayout: React.FC = () => {
  const { settings, navigate, orders, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const isPasswordSetUp = !!settings.adminPin && settings.adminPin.trim().length > 0;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('foodghor_admin_auth') === 'true'
  );

  const [authMode, setAuthMode] = useState<AuthMode>(
    isPasswordSetUp ? 'login' : 'setup'
  );

  // ---- Setup state ----
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupError, setSetupError] = useState('');
  const [showSetupPwd, setShowSetupPwd] = useState(false);

  // ---- Shared pending state (during recovery code display) ----
  const [pendingPassword, setPendingPassword] = useState('');
  const [pendingRecoveryCode, setPendingRecoveryCode] = useState('');
  const [recoverySavedConfirmed, setRecoverySavedConfirmed] = useState(false);

  // ---- Login state ----
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // ---- Forgot password state ----
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [newRecoveryCodeForDisplay, setNewRecoveryCodeForDisplay] = useState('');
  const [newRecoverySavedConfirmed, setNewRecoverySavedConfirmed] = useState(false);

  // ============================================================
  // Handlers
  // ============================================================

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (setupPassword.length < 6) {
      setSetupError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError('দুইটি পাসওয়ার্ড মিলছে না। আবার চেষ্টা করুন।');
      return;
    }

    // Generate recovery code (password NOT saved yet)
    const code = generateRecoveryCode();
    setPendingPassword(setupPassword);
    setPendingRecoveryCode(code);
    setRecoverySavedConfirmed(false);
    setAuthMode('setup-recovery-show');
  };

  const handleConfirmSetupRecovery = () => {
    if (!recoverySavedConfirmed) {
      alert('চেকবক্সে টিক দিন — আপনি রিকভারি কোড সেভ করেছেন কিনা নিশ্চিত করুন।');
      return;
    }
    // NOW save password + recovery code
    updateSettings({
      ...settings,
      adminPin: pendingPassword,
      adminRecoveryCode: pendingRecoveryCode,
    });
    sessionStorage.setItem('foodghor_admin_auth', 'true');
    setIsAuthenticated(true);
    // Reset
    setPendingPassword('');
    setPendingRecoveryCode('');
    setSetupPassword('');
    setSetupConfirm('');
    setRecoverySavedConfirmed(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (pinInput.trim() === settings.adminPin) {
      sessionStorage.setItem('foodghor_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinInput('');
    } else {
      setPinError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('foodghor_admin_auth');
    setIsAuthenticated(false);
    setAuthMode('login');
    navigate('/');
  };

  // ---- Forgot password flow ----
  const handleForgotStart = () => {
    setAuthMode('forgot-enter-code');
    setRecoveryCodeInput('');
    setRecoveryError('');
  };

  const handleVerifyRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    const stored = (settings.adminRecoveryCode || '').trim().toUpperCase().replace(/\s/g, '');
    const entered = recoveryCodeInput.trim().toUpperCase().replace(/\s/g, '');

    if (!stored) {
      setRecoveryError(
        'এই অ্যাকাউন্টে কোনো রিকভারি কোড সেট করা নেই। লগইন করে সেটিংস থেকে কোড সেট করুন।'
      );
      return;
    }

    if (entered !== stored) {
      setRecoveryError('ভুল রিকভারি কোড! আবার চেষ্টা করুন।');
      return;
    }

    setAuthMode('forgot-new-password');
    setNewPassword('');
    setNewPasswordConfirm('');
    setNewPasswordError('');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setNewPasswordError('');

    if (newPassword.length < 6) {
      setNewPasswordError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setNewPasswordError('দুইটি পাসওয়ার্ড মিলছে না।');
      return;
    }

    // Generate NEW recovery code (old one becomes invalid)
    const newCode = generateRecoveryCode();
    setPendingPassword(newPassword);
    setNewRecoveryCodeForDisplay(newCode);
    setNewRecoverySavedConfirmed(false);
    setAuthMode('forgot-new-recovery-show');
  };

  const handleConfirmNewRecovery = () => {
    if (!newRecoverySavedConfirmed) {
      alert('চেকবক্সে টিক দিন — আপনি নতুন রিকভারি কোড সেভ করেছেন কিনা নিশ্চিত করুন।');
      return;
    }
    updateSettings({
      ...settings,
      adminPin: pendingPassword,
      adminRecoveryCode: newRecoveryCodeForDisplay,
    });
    sessionStorage.setItem('foodghor_admin_auth', 'true');
    setIsAuthenticated(true);
    // Reset
    setPendingPassword('');
    setNewRecoveryCodeForDisplay('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setRecoveryCodeInput('');
    setNewRecoverySavedConfirmed(false);
  };

  const handleCancelForgot = () => {
    setAuthMode('login');
    setRecoveryCodeInput('');
    setRecoveryError('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setNewPasswordError('');
    setNewRecoveryCodeForDisplay('');
    setPendingPassword('');
    setRecoverySavedConfirmed(false);
    setNewRecoverySavedConfirmed(false);
  };

  // ============================================================
  // Render: Not authenticated
  // ============================================================
  if (!isAuthenticated) {
    // Recovery code display after setup
    if (authMode === 'setup-recovery-show') {
      return (
        <RecoveryCodeDisplayScreen
          code={pendingRecoveryCode}
          confirmed={recoverySavedConfirmed}
          onConfirmChange={setRecoverySavedConfirmed}
          onContinue={handleConfirmSetupRecovery}
        />
      );
    }

    // Recovery code display after password reset
    if (authMode === 'forgot-new-recovery-show') {
      return (
        <RecoveryCodeDisplayScreen
          code={newRecoveryCodeForDisplay}
          confirmed={newRecoverySavedConfirmed}
          onConfirmChange={setNewRecoverySavedConfirmed}
          onContinue={handleConfirmNewRecovery}
          isReset
        />
      );
    }

    // Setup screen
    if (authMode === 'setup') {
      return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg border border-emerald-700">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 font-serif">
              প্রথমবার অ্যাডমিন সেটআপ
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {settings.banglaName} অ্যাডমিন প্যানেলে ঢোকার জন্য একটি পাসওয়ার্ড তৈরি করুন
            </p>

            <form onSubmit={handleSetup} className="mt-6 space-y-4 text-left">
              {setupError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{setupError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  নতুন পাসওয়ার্ড <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSetupPwd ? 'text' : 'password'}
                    autoFocus
                    required
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSetupPwd(!showSetupPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showSetupPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthBar pwd={setupPassword} />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  পাসওয়ার্ড আবার লিখুন <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSetupPwd ? 'text' : 'password'}
                    required
                    value={setupConfirm}
                    onChange={(e) => setSetupConfirm(e.target.value)}
                    placeholder="আবার একই পাসওয়ার্ড দিন"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 font-mono ${
                      setupConfirm.length > 0 && setupPassword !== setupConfirm
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-stone-300 focus:ring-emerald-700/30 focus:border-emerald-700'
                    }`}
                  />
                  {setupConfirm.length > 0 && setupPassword === setupConfirm && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {setupConfirm.length > 0 && setupPassword !== setupConfirm && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    ⚠️ দুইটি পাসওয়ার্ড মিলছে না
                  </p>
                )}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  পাসওয়ার্ড তৈরি হলে একটি <strong>রিকভারি কোড</strong> দেখানো হবে — সেটি অবশ্যই
                  সেভ করবেন। পাসওয়ার্ড ভুলে গেলে ওই কোড দিয়েই রিসেট করতে হবে।
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                পাসওয়ার্ড তৈরি করুন
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>মূল ওয়েবসাইটে ফিরে যান</span>
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Forgot: enter recovery code
    if (authMode === 'forgot-enter-code') {
      return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-lg border border-amber-300">
              <Key className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-stone-900 font-serif">
              রিকভারি কোড দিন
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              পাসওয়ার্ড রিসেট করতে হলে আগে আপনার রিকভারি কোডটি দিন
            </p>

            <form onSubmit={handleVerifyRecoveryCode} className="mt-6 space-y-4 text-left">
              {recoveryError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{recoveryError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  আপনার রিকভারি কোড
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={recoveryCodeInput}
                  onChange={(e) => setRecoveryCodeInput(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                />
                <p className="text-[10px] text-stone-500 mt-1 text-center">
                  ড্যাশ (-) সহ বা ছাড়াও দিতে পারবেন
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                কোড যাচাই করুন
              </button>

              <button
                type="button"
                onClick={handleCancelForgot}
                className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>লগইন পেজে ফিরে যান</span>
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Forgot: set new password
    if (authMode === 'forgot-new-password') {
      return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-lg border border-emerald-300">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-stone-900 font-serif">
              নতুন পাসওয়ার্ড সেট করুন
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              নতুন পাসওয়ার্ড সেট হলে একটি নতুন রিকভারি কোডও তৈরি হবে
            </p>

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4 text-left">
              {newPasswordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{newPasswordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  নতুন পাসওয়ার্ড <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    autoFocus
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthBar pwd={newPassword} />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  পাসওয়ার্ড আবার লিখুন <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    required
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="আবার একই পাসওয়ার্ড দিন"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 font-mono ${
                      newPasswordConfirm.length > 0 && newPassword !== newPasswordConfirm
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-stone-300 focus:ring-emerald-700/30 focus:border-emerald-700'
                    }`}
                  />
                  {newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                নতুন পাসওয়ার্ড সেট করুন
              </button>

              <button
                type="button"
                onClick={handleCancelForgot}
                className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>বাতিল করুন</span>
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Default: Login screen
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg border border-emerald-700">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 font-serif">
            {settings.banglaName} অ্যাডমিন পোর্টাল
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            ম্যানেজমেন্ট প্যানেলে প্রবেশের জন্য পাসওয়ার্ড দিন
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            {pinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{pinError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPwd ? 'text' : 'password'}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPwd(!showLoginPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              লগইন করুন
            </button>

            <button
              type="button"
              onClick={handleForgotStart}
              className="w-full py-2 text-amber-700 hover:text-amber-900 text-xs font-semibold cursor-pointer underline underline-offset-2"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // Render: Authenticated admin layout
  // ============================================================
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const hasRecoveryCode = !!(settings.adminRecoveryCode && settings.adminRecoveryCode.trim().length > 0);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-950 text-stone-300 flex flex-col justify-between shrink-0 border-r border-stone-800 md:h-screen md:sticky md:top-0">
        <div>
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-400 font-bold text-base flex items-center justify-center">
                ফু
              </div>
              <div>
                <span className="font-bold text-white text-base font-serif block leading-none">
                  {settings.banglaName}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase block mt-0.5">
                  Admin Central
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
              title="ওয়েবসাইট ভিউ দেখুন"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ড্যাশবোর্ড ও ওভারভিউ</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>প্রোডাক্ট ও সেলস ফানেল</span>
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Images className="w-4 h-4" />
              <span>৫টি ব্যানার স্লাইডার</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>অর্ডার ও ইনভয়েস</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-400 text-stone-950 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>কাস্টমার ডাটাবেজ</span>
            </button>
            <button
              onClick={() => setActiveTab('courier')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'courier'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>কুরিয়ার ট্র্যাকিং সেটআপ</span>
            </button>
            <button
              onClick={() => setActiveTab('pixel')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'pixel'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Facebook Pixel সেটআপ</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>লোগো ও স্টোর সেটিংস</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-stone-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>মূল ওয়েবসাইটে যান</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 text-xs font-semibold rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Warning banner if no recovery code */}
        {!hasRecoveryCode && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-[11px] sm:text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="flex-1">
              আপনার অ্যাকাউন্টে <strong>রিকভারি কোড সেট করা নেই</strong>। পাসওয়ার্ড ভুলে গেলে
              লগইন করতে পারবেন না।{' '}
              <button
                onClick={() => setActiveTab('settings')}
                className="underline font-bold hover:text-amber-950"
              >
                এখনই সেট করুন →
              </button>
            </span>
          </div>
        )}

        <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-bold text-stone-900 text-base sm:text-lg font-serif">
              {activeTab === 'dashboard' && 'ড্যাশবোর্ড ও ওভারভিউ'}
              {activeTab === 'products' && 'প্রোডাক্ট ও সেলস ফানেল ল্যান্ডিং পেজ বিল্ডার'}
              {activeTab === 'banners' && 'হোমপেজ ব্যানার ক্যারোসেল (৫টি ফটো)'}
              {activeTab === 'orders' && 'অর্ডার লিস্ট ও ক্যাশ মেমো'}
              {activeTab === 'users' && 'কাস্টমার ডাটাবেজ ও প্রোফাইল'}
              {activeTab === 'courier' && 'কুরিয়ার সার্ভিস ও ট্র্যাকিং সেটআপ'}
              {activeTab === 'pixel' && 'Facebook Pixel & Events Setup'}
              {activeTab === 'settings' && 'লোগো ও জেনারেল সেটিংস'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 hidden sm:inline">অ্যাডমিন মোড সক্রিয়</span>
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-700" />
              <span>স্টোর দেখুন</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'banners' && <AdminBanners />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'courier' && <AdminCourier />}
          {activeTab === 'pixel' && <AdminPixel />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};