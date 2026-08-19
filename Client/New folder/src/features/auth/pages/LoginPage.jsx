import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    login(email, password, rememberMe);
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

        {/* Narrative and Animated Visual */}
        <div className="relative z-10 my-auto space-y-6 max-w-sm">
          <h2 className="text-3xl md:text-[40px] lg:text-[44px] font-extrabold tracking-tight text-white leading-tight">
            Decode software <br /> architecture.
          </h2>
          <p className="text-slate-300 font-sans text-lg md:text-[22px] lg:text-[24px] leading-relaxed">
            Sign in to start index call graphs, trace transaction paths, and resolve circular dependencies automatically.
          </p>

          {/* Ambient SVG decoration */}
          <div className="pt-6 relative">
            <svg className="w-full h-32 text-[#30363d]" viewBox="0 0 300 120">
              <g stroke="#3e4651" strokeWidth="1.2" strokeDasharray="3 3">
                <line x1="50" y1="60" x2="150" y2="20" />
                <line x1="50" y1="60" x2="150" y2="100" />
                <line x1="150" y1="20" x2="250" y2="60" />
                <line x1="150" y1="100" x2="250" y2="60" />
              </g>
              <circle cx="50" cy="60" r="7.5" fill="#0d1117" stroke="#00f0ff" strokeWidth="3.5" />
              <circle cx="150" cy="20" r="7.5" fill="#0d1117" stroke="#a855f7" strokeWidth="3.5" />
              <circle cx="150" cy="100" r="7.5" fill="#0d1117" stroke="#10b981" strokeWidth="3.5" />
              <circle cx="250" cy="60" r="7.5" fill="#0d1117" stroke="#00f0ff" strokeWidth="3.5" />
            </svg>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[15px] text-gray-500 font-sans">
          CodeMap AI © 2026. Premium codebase analytics interface.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-8 md:p-12 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:32px_32px] opacity-5 pointer-events-none" />

        <div className="max-w-[400px] w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold tracking-tight text-white">Sign In</h1>
            <p className="text-[17px] text-slate-300 font-sans">Enter your credentials to manage workspace environments.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="e.g. admin@codemap.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              className="font-mono text-xs"
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                className="font-mono text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[32px] text-slate-400 hover:text-white cursor-pointer select-none"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Me and Forgot Password (UI only) */}
            <div className="flex items-center justify-between text-xs font-sans text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#0d1117] text-[#00f0ff] focus:ring-0"
                />
                <span>Remember Me</span>
              </label>
              <button 
                type="button" 
                onClick={() => alert('Demo Feature: Forgot password UI simulation')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-mono text-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] border-[#00f0ff]/40"
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full py-2.5 font-mono text-xs cursor-pointer border-[#3e4651]"
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* Social Separator */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-x-0 border-t border-[#30363d]/40" />
            <span className="relative px-3 bg-[#040609] text-[10px] text-gray-500 uppercase tracking-widest font-sans">Or continue with</span>
          </div>

          {/* Google login placeholder */}
          <button
            disabled
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-md border border-[#30363d]/30 bg-[#0d1117]/30 text-gray-500 text-xs cursor-not-allowed select-none"
          >
            <svg className="w-4 h-4 shrink-0 opacity-40" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.978 0-.74-.08-1.3-.178-1.86H12.24z"/>
            </svg>
            <span className="font-sans">Sign in with Google (disabled)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
