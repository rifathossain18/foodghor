import React, { useState } from 'react';
import { X, UserPlus, LogIn, ShieldCheck, Phone, Mail, User, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface UserAuthModalProps {
  onSuccess?: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ onSuccess }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, registerUser, loginUser, currentUser } = useStore();
  const [tab, setTab] = useState<'register' | 'login'>('register');

  // Register state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)।');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      registerUser(name, phone, email, address, city);
      setIsAuthModalOpen(false);
      if (onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('মোবাইল নম্বর অথবা ইমেইল এড্রেস দিন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = loginUser(loginIdentifier);
      if (user) {
        setIsAuthModalOpen(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg('এই মোবাইল বা ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে নতুন অ্যাকাউন্ট তৈরি করুন।');
        setTab('register');
        if (loginIdentifier.includes('@')) {
          setEmail(loginIdentifier);
        } else {
          setPhone(loginIdentifier);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            {tab === 'register' ? 'কাস্টমার অ্যাকাউন্ট তৈরি করুন' : 'অ্যাকাউন্টে লগইন করুন'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            পণ্য অর্ডার নিশ্চিত করতে নাম, মোবাইল নম্বর ও ইমেইল দিয়ে প্রোফাইল তৈরি করুন
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-stone-100 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            নতুন অ্যাকাউন্ট তৈরি
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ইতিমধ্যে অ্যাকাউন্ট আছে
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Registration Form */}
        {tab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                আপনার নাম <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-sans focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                ইমেইল এড্রেস <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-sans focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">ডেলিভারি ঠিকানা</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'প্রোফাইল তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি ও কনফার্ম করুন'}</span>
            </button>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                মোবাইল নম্বর অথবা ইমেইল এড্রেস
              </label>
              <input
                type="text"
                required
                autoFocus
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="017xxxxxxxx অথবা ইমেইল"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-sans focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
            </button>

            <div className="pt-2 text-center">
              <span className="text-stone-500 text-[11px]">
                অ্যাকাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-emerald-800 font-bold hover:underline"
                >
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </button>
              </span>
            </div>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>আপনার ব্যক্তিগত তথ্য ১০০% সুরক্ষিত ও নিরাপদ থাকবে</span>
        </div>
      </div>
    </div>
  );
};
