import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';

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
    <div className="flex items-center justify-center min-h-screen p-4 bg-canvas font-sans text-on-surface select-none">
      <main className="w-full max-w-[440px] z-10">
        {/* Center Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 shadow-sm text-white">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            </div>
            <h1 className="text-xl font-bold font-display text-on-surface text-center">Access Your CodeMap Workspace</h1>
            <p className="text-xs text-on-surface-variant mt-2 text-center">Enter your credentials to continue to the intelligent engine.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative">
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-on-surface-variant" htmlFor="password">Password</label>
                <a className="text-xs font-bold text-primary hover:underline transition-all" href="#forgot">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input 
                  className={`w-full pl-10 pr-12 py-2.5 bg-white border ${errors.password ? 'border-error' : 'border-[#e2e8f0]'} rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  type={showPassword ? 'text' : 'password'}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant cursor-pointer" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input 
                className="w-4 h-4 rounded border-[#e2e8f0] text-primary focus:ring-primary cursor-pointer" 
                id="remember" 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="ml-2 text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember me for 30 days</label>
            </div>

            {/* Action Button */}
            <button 
              className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm cursor-pointer" 
              type="submit"
            >
              Sign In to Workspace
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span class="w-full border-t border-[#e2e8f0]"></span></div>
            <div className="relative flex justify-center text-xs font-bold uppercase"><span class="bg-white px-4 text-outline">Or continue with</span></div>
          </div>

          {/* Social/SSO Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-[#e2e8f0] rounded-lg bg-white hover:bg-[#eff4ff] transition-colors active:scale-[0.98] cursor-pointer">
              <div className="w-5 h-5 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeMjUvVf02zOrK0YMI77PSUXQr9UUWmpPJXKkseeqBP0dXJgeBKjrgZSw-trMNsTMD8doHLF3nbLRBtZv2DfF8_bImWSApr-AA819DFa2tPWaZYVbXE5yHUzSLvngNUow-Ar65W89snfzv0asXkIMccGxFT5Hdy9Gnis8AySqtgDXMeDIPzgZk6-kmzsvSNAa6rhFF9hzCTf9iLJOh_EEleWXzsG3KHqRJPd7MV8xFtskTjDf-ZubQfCSFIb9L51NvFKLwxSe1zX0')" }}></div>
              <span className="text-xs font-semibold text-on-surface">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-[#e2e8f0] rounded-lg bg-white hover:bg-[#eff4ff] transition-colors active:scale-[0.98] cursor-pointer">
              <div className="w-5 h-5 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7UkajfwY7dwfjEqJxj_G5et6TXmOqgQUDv6iwZ_gwPhsiw27Z-B_QWuk-2kcyBrsRfcuw0fbcvPh6glpwl-zZpMc_yNoJ2jOVHTkfQ_1jADPB0W_gQP4iIJysqvj8T7hRc6YdlPYlFEtFxakk2jFAqVDqT-UqaxgB2PsgVE5gq8siFgkJHLIfZwrPLaS-NSTnCtKLQhCG5mvXQxcna9D924yWhrGZJt7q1Q8a7c8o5YI4C9x8UV5maKxJImR15FUuWIzapad9GHc')" }}></div>
              <span className="text-xs font-semibold text-on-surface">Google</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-xs text-on-surface-variant">
          New to CodeMap? 
          <NavLink className="text-primary font-bold hover:underline ml-1" to="/register">Create an account</NavLink>
        </p>

        {/* Terms & Privacy */}
        <div className="flex justify-center gap-4 mt-12 opacity-60 text-xs">
          <a className="font-bold text-on-surface-variant hover:text-on-surface transition-colors" href="#privacy">Privacy Policy</a>
          <span className="text-outline">•</span>
          <a className="font-bold text-on-surface-variant hover:text-on-surface transition-colors" href="#terms">Terms of Service</a>
        </div>
      </main>
    </div>
  );
}
