import React, { useState } from 'react';

export default function ExecutionFlowPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('POST /api/auth/login');
  const [activeStep, setActiveStep] = useState('login');

  const steps = [
    {
      id: 'login',
      title: 'POST /api/auth/login',
      duration: '12ms',
      description: 'Entry point for authentication service. Handles payload validation and rate limiting.',
      type: 'Controller',
      status: 'Active',
      file: 'services/auth.service.js',
      icon: 'login',
      indent: 0,
      code: `async function login(req, res) {
  // Initialize trace span
  const span = tracer.startSpan('auth_login');
  
  try {
    const { email, password } = req.body;
    
    // Step 1: Validation
    await validate_user_request(email, password);
    
    // Step 2: Database lookup
    const user = await query_db_by_email(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Step 3: Password verification
    const isValid = await bcrypt_compare(password, user.hash);
    
    if (isValid) {
      return generate_jwt_response(user);
    }
  } catch (err) {
    span.setTag('error', true);
    return res.status(401).send(err.message);
  } finally {
    span.finish();
  }
}`
    },
    {
      id: 'validate',
      title: 'validate_user_request',
      duration: '4ms',
      description: 'Joi schema validation for email and password presence/format.',
      type: 'Validator',
      status: 'Ready',
      file: 'middleware/validator.js',
      icon: 'rule',
      indent: 8,
      code: `async function validate_user_request(email, password) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });
  
  const { error } = schema.validate({ email, password });
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
}`
    },
    {
      id: 'db',
      title: 'query_db_by_email',
      duration: '142ms',
      description: 'PostgreSQL query to fetch user record. Performance bottleneck detected.',
      type: 'Database Query',
      status: 'Slow Query',
      file: 'data/db.client.js',
      icon: 'database',
      indent: 16,
      code: `async function query_db_by_email(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  // Optimization note: Check if index exists on email column
  const start = Date.now();
  const result = await pool.query(query, [email]);
  
  console.log(\`Query took \${Date.now() - start}ms\`);
  return result.rows[0];
}`
    },
    {
      id: 'hash',
      title: 'bcrypt_compare',
      duration: '85ms',
      description: 'Verifying supplied password against salt/hash stored securely in database.',
      type: 'Crypto',
      status: 'Ready',
      file: 'utils/crypto.js',
      icon: 'lock_open',
      indent: 8,
      code: `async function bcrypt_compare(plain, hashed) {
  // Uses native C++ bindings for heavy hashing operations
  // Cost work factor is currently configured to 12
  return await bcrypt.compare(plain, hashed);
}`
    },
    {
      id: 'response',
      title: 'generate_jwt_response',
      duration: '8ms',
      description: 'Signing JWT session token and returning 200 OK standard response payload.',
      type: 'Utility',
      status: 'Success',
      file: 'utils/auth.utils.js',
      icon: 'send',
      indent: 0,
      code: `function generate_jwt_response(user) {
  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return { status: 'success', token };
}`
    }
  ];

  const activeStepData = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden font-sans text-on-surface bg-canvas">
      
      {/* Header and Endpoint selector */}
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white border-b border-[#e2e8f0] gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-on-surface">Execution Flow Analysis</h2>
          <p className="text-xs text-on-surface-variant font-semibold">Tracing structural dependencies and call paths for code understanding.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Endpoint</label>
          <div className="relative">
            <select 
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] px-4 py-2 pr-10 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer shadow-sm"
            >
              <option>POST /api/auth/login</option>
              <option>GET /api/user/profile</option>
              <option>PUT /api/orders/update</option>
              <option>DELETE /api/session/clear</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">expand_more</span>
          </div>
          <button 
            onClick={() => alert('Launching execution trace simulator...')}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            RUN TRACE
          </button>
        </div>
      </div>

      {/* Split Viewer Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Call Stack Steps timeline */}
        <div className="w-1/2 overflow-y-auto p-6 bg-slate-50 border-r border-[#e2e8f0] custom-scrollbar relative">
          <div className="relative">
            {/* The vertical timeline connector line */}
            <div className="absolute left-[36px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary to-[#d3e4fe] z-0"></div>
            
            <div className="space-y-8 relative z-10">
              {steps.map((step) => {
                const isSelected = activeStep === step.id;
                return (
                  <div 
                    key={step.id} 
                    onClick={() => setActiveStep(step.id)}
                    className="flex gap-4 group cursor-pointer transition-all duration-200"
                    style={{ marginLeft: `${step.indent}px` }}
                  >
                    {/* Circle icon marker */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 transition-transform group-hover:scale-105 ${
                      isSelected 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-outline border-[#e2e8f0] group-hover:border-primary group-hover:text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                    </div>

                    {/* Step Content Card */}
                    <div className={`bg-white p-4 rounded-xl border flex-grow shadow-sm transition-all ${
                      isSelected 
                        ? 'border-primary ring-2 ring-primary/10' 
                        : 'border-[#e2e8f0] hover:border-primary'
                    }`}>
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className={`text-xs font-bold transition-colors ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-outline font-semibold">{step.duration}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="mt-3 flex gap-2">
                        <span className="px-2 py-0.5 bg-[#eff4ff] text-primary text-[9px] rounded font-bold uppercase tracking-wide">
                          {step.type}
                        </span>
                        {step.status === 'Slow Query' ? (
                          <span className="px-2 py-0.5 bg-error-container text-error text-[9px] rounded font-bold uppercase tracking-wide flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">warning</span>
                            Slow Query
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#d1fae5] text-[#065f46] text-[9px] rounded font-bold uppercase tracking-wide">
                            {step.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Code Viewer & terminal logs */}
        <div className="w-1/2 flex flex-col bg-[#213145] border-l border-[#737686]/30">
          {/* Code Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-[#0b1c30]/40 text-white border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">code</span>
              <span className="font-mono text-xs font-semibold opacity-90">{activeStepData.file}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
            </div>
          </div>

          {/* Source Code Container */}
          <div className="flex-grow p-6 overflow-auto custom-scrollbar font-mono text-xs leading-relaxed text-slate-300">
            <pre className="whitespace-pre select-text">
              {activeStepData.code}
            </pre>
          </div>

          {/* Terminal log console */}
          <div className="h-28 bg-black/30 border-t border-white/5 p-4 flex flex-col justify-between shrink-0 font-mono">
            <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">terminal</span>
              Runtime Output
            </div>
            <div className="text-[11px] text-green-400/80 space-y-1 mt-2">
              <div className="flex gap-3">
                <span className="opacity-40">[10:42:01]</span>
                <span>TRACE: Entering {activeStepData.title} in {activeStepData.file}</span>
              </div>
              {activeStepData.id === 'db' && (
                <div className="flex gap-3 text-yellow-400">
                  <span className="opacity-40">[10:42:02]</span>
                  <span>WARN: DB query execution time (142ms) exceeds threshold of 100ms</span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="opacity-40">[10:42:02]</span>
                <span>TRACE: Context validation parsed cleanly.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
