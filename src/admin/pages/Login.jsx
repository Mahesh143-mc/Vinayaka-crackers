import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  KeyRound, 
  Flame, 
  ChevronLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useToast } from '../../context/ToastContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword, currentUser } = useAuth();
  const { storeSettings } = useStoreSettings();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // If already logged in, redirect directly to /admin
  React.useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showToast('🎉 Welcome back, Admin! Secure session established.', 'success');
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error("Login unexpected error:", err);
      setErrorMessage('An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      showToast('Please enter your admin email address.', 'error');
      return;
    }

    setIsResetting(true);
    try {
      const res = await resetPassword(resetEmail);
      if (res.success) {
        setResetSuccess(true);
        showToast('Password reset link sent to your email!', 'success');
      } else {
        showToast(res.error || 'Failed to send reset link', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error sending reset link', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const brandName = storeSettings?.companyName || 'Karuppa Crackers';
  const logoUrl = storeSettings?.logo || storeSettings?.companyLogo || "https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#250606] via-[#4A0E0E] to-[#1a0404] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Fireworks & Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FFD700]/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF4500]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4A0E0E]/40 blur-3xl" />
      </div>

      {/* Floating Header Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 hover:text-[#FFD700] backdrop-blur-md border border-white/15 text-xs font-bold transition-all shadow-md"
        >
          <ChevronLeft size={16} /> Return to Store
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] rounded-3xl sm:rounded-[32px] p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-2 border-amber-400/40 relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white p-2.5 shadow-xl border-2 border-amber-400/60 flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt={brandName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#4A0E0E] text-[#FFD700] p-1.5 rounded-full border border-amber-300 shadow-sm">
              <Sparkles size={14} />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#4A0E0E] tracking-tight">
              {brandName}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-amber-800/90 mt-0.5">
              Secure Administration Portal
            </p>
          </div>

          {/* SSL Security Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-black">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>256-Bit SSL Encrypted Admin Portal</span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-900/60">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@karuppacrackers.com"
                className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-amber-900/20 focus:border-[#4A0E0E] rounded-2xl text-sm font-bold text-gray-900 focus:outline-none shadow-sm transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider">
                Admin Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setResetEmail(email);
                  setResetSuccess(false);
                }}
                className="text-[11px] font-black text-amber-800 hover:text-[#4A0E0E] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-900/60">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-white border-2 border-amber-900/20 focus:border-[#4A0E0E] rounded-2xl text-sm font-bold text-gray-900 focus:outline-none shadow-sm transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#4A0E0E] cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-amber-900/30 text-[#4A0E0E] focus:ring-[#4A0E0E] cursor-pointer accent-[#4A0E0E]"
              />
              <span className="text-xs font-bold text-gray-700">Stay signed in on this device</span>
            </label>
          </div>

          {/* Submit Sign In Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] hover:from-[#380808] hover:to-[#380808] text-[#FFD700] font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl border-2 border-amber-400/40 transition-all transform hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin text-[#FFD700]" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Access Admin Control Center</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-amber-900/10 text-center">
          <p className="text-[11px] font-bold text-gray-500 flex items-center justify-center gap-1.5">
            <Lock size={12} className="text-amber-800" />
            <span>Authorized store management personnel only.</span>
          </p>
        </div>
      </div>

      {/* Forgot Password Reset Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 relative space-y-5 animate-in zoom-in-95">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <KeyRound size={26} />
              </div>
              <h3 className="text-xl font-serif font-black text-gray-900">Reset Admin Password</h3>
              <p className="text-xs font-bold text-gray-600">
                Enter your registered admin email address. A password reset link will be sent to your inbox.
              </p>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                <p className="text-sm font-black text-emerald-900">Reset Email Sent Successfully!</p>
                <p className="text-xs font-medium text-emerald-700">Check your inbox or spam folder to complete password reset.</p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 bg-emerald-700 text-white rounded-xl font-black text-xs mt-3 cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@karuppacrackers.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-amber-900/20 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 py-3 bg-[#4A0E0E] text-[#FFD700] hover:bg-[#380808] rounded-xl font-black text-xs shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isResetting ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
