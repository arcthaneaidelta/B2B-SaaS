import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useDemo } from '../../state/demo-store';
import { DEMO_PERSONAS } from '../../data/personas';
import { PersonaRole } from '../../types';

export const PublicLogin: React.FC = () => {
  const [email, setEmail] = useState('alex.morgan@nordicindustrial.se');
  const [password, setPassword] = useState('••••••••••••');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { dispatch, showToast } = useDemo();
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Signed in to demo employer workspace', 'success');
    navigate('/app/employer/overview');
  };

  const handlePersonaDirect = (role: PersonaRole, defaultPath: string) => {
    dispatch({ type: 'SWITCH_PERSONA', payload: role });
    navigate(defaultPath);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModal(false);
      showToast('Simulated password reset instructions sent', 'info');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#24483D] flex items-center justify-center text-white font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-[#E7EEE7]" />
          </div>
          <span className="font-bold text-[#28332F] text-lg">VERITY</span>
        </Link>
        <Link to="/" className="text-xs font-semibold text-[#777F79] hover:text-[#24483D]">
          ← Back to Landing Page
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white border border-[#E5E5DD] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#E7EEE7] text-[#24483D] flex items-center justify-center mx-auto border border-[#C5D9C5]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#28332F]">Sign in to VERITY</h1>
            <p className="text-xs text-[#777F79]">
              Access your verified workforce workspace or candidate portal
            </p>
          </div>

          {/* Quick Demo Bypass Banner (Page 19) */}
          <div className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#24483D]">
              <Sparkles className="w-4 h-4 text-[#356653]" />
              <span>Explore Demo without Credentials</span>
            </div>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Skip typing credentials. Select any fictional persona to enter their fully functional workspace:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaDirect(p.id, p.defaultPath)}
                  className="p-2 text-left bg-white hover:bg-[#E7EEE7]/50 border border-[#E5E5DD] rounded-lg text-xs transition-colors flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#24483D] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {p.avatarInitials}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-[#28332F] block truncate text-[11px]">{p.name}</span>
                    <span className="text-[9px] text-[#777F79] capitalize">{p.id}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E5E5DD] w-full" />
            <span className="bg-white px-3 text-xs text-[#777F79] uppercase tracking-wider">or sign in</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#28332F] mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24483D] text-[#28332F]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#28332F]">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-[#356653] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24483D] text-[#28332F]"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Enter Workspace (Demo Mode)
            </Button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#28332F]/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-[#E5E5DD] shadow-xl space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-[#28332F]">Simulated Password Reset</h3>
            <p className="text-xs text-[#777F79]">
              In this demo prototype, enter your email to simulate a reset token dispatch. No external emails are sent.
            </p>
            {forgotSuccess ? (
              <div className="p-3 bg-[#E7EEE7] border border-[#C5D9C5] rounded-lg text-xs text-[#24483D] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulated link dispatched successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@company.se"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E5DD] rounded-lg focus:ring-1 focus:ring-[#24483D]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setForgotModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Send Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer copyright note */}
      <p className="text-center text-xs text-[#777F79]">
        VERITY Demonstration Sandbox · All authentication workflows simulated locally.
      </p>
    </div>
  );
};
