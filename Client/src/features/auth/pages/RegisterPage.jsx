import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteTeammates, setInviteTeammates] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Satisfy register backend parameter acceptTerms = true by default
    register(fullName, email, password, confirmPassword, true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-canvas font-sans text-on-surface select-none">
      <main className="w-full max-w-[480px] z-10">
        
        {/* Branding Anchor */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20 text-white">
            <span className="material-symbols-outlined text-on-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <h1 className="text-lg font-bold font-display text-on-surface tracking-tight">CodeMap AI</h1>
          <p className="text-xs text-outline mt-1 font-semibold">Intelligent Engine for Modern Teams</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold font-display text-on-surface mb-2">Create Your CodeMap Account</h2>
            <p className="text-xs text-on-surface-variant">Start mapping your infrastructure with AI-driven precision.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block" htmlFor="name">FULL NAME</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                <input 
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.fullName ? 'border-error' : 'border-[#e2e8f0]'} rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  type="text"
                />
              </div>
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block" htmlFor="email">EMAIL ADDRESS</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input 
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-error' : 'border-[#e2e8f0]'} rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                  id="email" 
                  name="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </div>
              {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block" htmlFor="password">PASSWORD</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input 
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.password ? 'border-error' : 'border-[#e2e8f0]'} rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                  />
                </div>
                {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block" htmlFor="confirm_password">CONFIRM</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock_reset</span>
                  <input 
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.confirmPassword ? 'border-error' : 'border-[#e2e8f0]'} rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                    id="confirm_password" 
                    name="confirm_password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    type="password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input 
                  className="w-5 h-5 rounded border-[#e2e8f0] text-primary focus:ring-primary/20 cursor-pointer" 
                  id="invite_teammates" 
                  name="invite_teammates" 
                  type="checkbox"
                  checked={inviteTeammates}
                  onChange={(e) => setInviteTeammates(e.target.checked)}
                />
              </div>
              <div className="text-sm">
                <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="invite_teammates">
                  Invite teammates to this workspace
                  <p className="text-[11px] text-outline mt-0.5 font-normal">We'll help you set up your team directory in the next step.</p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-primary/10 cursor-pointer text-xs font-bold" 
                type="submit"
              >
                SIGN UP FOR FREE
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-[#e2e8f0]"></div>
            <span className="text-xs font-bold text-outline">OR REGISTER WITH</span>
            <div className="h-px flex-1 bg-[#e2e8f0]"></div>
          </div>

          {/* Social Signup Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-[#e2e8f0] rounded-lg py-2.5 hover:bg-[#eff4ff] transition-colors text-xs font-semibold text-on-surface cursor-pointer">
              <div className="w-5 h-5 overflow-hidden flex items-center justify-center">
                <img className="w-full h-full object-contain" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeMjUvVf02zOrK0YMI77PSUXQr9UUWmpPJXKkseeqBP0dXJgeBKjrgZSw-trMNsTMD8doHLF3nbLRBtZv2DfF8_bImWSApr-AA819DFa2tPWaZYVbXE5yHUzSLvngNUow-Ar65W89snfzv0asXkIMccGxFT5Hdy9Gnis8AySqtgDXMeDIPzgZk6-kmzsvSNAa6rhFF9hzCTf9iLJOh_EEleWXzsG3KHqRJPd7MV8xFtskTjDf-ZubQfCSFIb9L51NvFKLwxSe1zX0')" }} />
              </div>
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#e2e8f0] rounded-lg py-2.5 hover:bg-[#eff4ff] transition-colors text-xs font-semibold text-on-surface cursor-pointer">
              <div className="w-5 h-5 overflow-hidden flex items-center justify-center">
                <img className="w-full h-full object-contain" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC56CaFhiUELjIMi3oUHssoknTHTtgthx5NHuAHH4l1rbNn9RogemCGax1OLJ_B2FKyEoVEACdVSpnFm7hjXotqYoFCCgIiwR4-NHJ6tJM2x7pgzSDhfr0QKoQTSNFUXvqBfLu8WzSJfOKQLS3zbwVID84FHJwNIfT11UYRyZs7VOpEc1nEXAL0OMRkk7gwnZlqi2wkOv3uniOMKksMo7S_dQFJpypyAgsJ2HWeDmOGQpSqZQHt0uqlGLIf8hrNQRyVFqUlKCYRaVw')" }} />
              </div>
              Google
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <p className="text-xs text-on-surface-variant">
            Already have an account? 
            <NavLink className="text-primary font-bold hover:underline ml-1" to="/login">Sign in</NavLink>
          </p>
        </div>

        {/* System Status Mini-Indicator */}
        <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            API ONLINE
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            AUTH V2.4
          </div>
        </div>
      </main>
    </div>
  );
}
