import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    register(fullName, email, password, confirmPassword, acceptTerms);
  };

  return (
    <div className="min-h-screen bg-[#040609] text-gray-200 flex flex-col md:flex-row overflow-hidden font-mono select-none">
      {/* Left side: branding, product description and ambient animated grid */}
      <div className="relative w-full md:w-[45%] bg-[#080c14] border-r border-[#1f2937]/30 flex flex-col justify-between p-8 md:p-12 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 border border-[#00f0ff]/30 flex items-center justify-center">
            <span className="text-sm font-extrabold text-[#00f0ff]">CM</span>
          </div>
          <span className="text-base font-bold tracking-wider text-white">CODEMAP<span className="text-[#00f0ff]">AI</span></span>
        </div>

        {/* Narrative */}
        <div className="relative z-10 my-auto space-y-6 max-w-sm">
          <h2 className="text-3xl md:text-[40px] lg:text-[44px] font-extrabold tracking-tight text-white leading-tight">
            Create your <br /> developer account.
          </h2>
          <p className="text-slate-300 font-sans text-lg md:text-[22px] lg:text-[24px] leading-relaxed">
            Join CodeMap AI to trace workflows, debug modules, and organize software blueprint models interactively.
          </p>

          {/* SVG path decoration */}
          <div className="pt-6 relative">
            <svg className="w-full h-32 text-[#30363d]" viewBox="0 0 300 120">
              <g stroke="#3e4651" strokeWidth="1.2" strokeDasharray="3 3">
                <line x1="50" y1="20" x2="150" y2="60" />
                <line x1="50" y1="100" x2="150" y2="60" />
                <line x1="150" y1="60" x2="250" y2="20" />
                <line x1="150" y1="60" x2="250" y2="100" />
              </g>
              <circle cx="50" cy="20" r="7.5" fill="#0d1117" stroke="#00f0ff" strokeWidth="3.5" />
              <circle cx="50" cy="100" r="7.5" fill="#0d1117" stroke="#a855f7" strokeWidth="3.5" />
              <circle cx="150" cy="60" r="7.5" fill="#0d1117" stroke="#10b981" strokeWidth="3.5" />
              <circle cx="250" cy="20" r="7.5" fill="#0d1117" stroke="#a855f7" strokeWidth="3.5" />
              <circle cx="250" cy="100" r="7.5" fill="#0d1117" stroke="#00f0ff" strokeWidth="3.5" />
            </svg>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[15px] text-gray-500 font-sans">
          CodeMap AI © 2026. Premium codebase analytics interface.
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-8 md:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:32px_32px] opacity-5 pointer-events-none" />

        <div className="max-w-[400px] w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold tracking-tight text-white">Create Account</h1>
            <p className="text-[17px] text-slate-300 font-sans">Register your local session profile below.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <Input
              label="Full Name"
              id="fullName"
              type="text"
              placeholder="e.g. Mukesh Kushwaha"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              required
              className="font-mono text-xs"
            />

            {/* Email Field */}
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="e.g. user@codemap.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              className="font-mono text-xs"
            />

            {/* Password Field */}
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              className="font-mono text-xs"
            />

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
              className="font-mono text-xs"
            />

            {/* Terms checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2 cursor-pointer select-none text-xs font-sans text-slate-400">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#0d1117] text-[#00f0ff] focus:ring-0 mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <button type="button" onClick={() => alert('Demo Terms Policy')} className="text-cyan-400 hover:underline">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" onClick={() => alert('Demo Privacy Policy')} className="text-cyan-400 hover:underline">Privacy Policy</button>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-red-400 mt-1 font-mono">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Register button */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-mono text-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] border-[#00f0ff]/40"
              >
                Create Account
              </Button>
              <div className="text-center font-sans text-xs text-slate-400 pt-1">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-cyan-400 hover:underline cursor-pointer font-mono"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
