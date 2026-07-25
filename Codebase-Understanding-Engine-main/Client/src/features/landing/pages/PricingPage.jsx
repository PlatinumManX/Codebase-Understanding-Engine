import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import Button from '../../../shared/components/Button';

export default function PricingPage({ isSection = false }) {
  const plans = [
    {
      name: 'Student',
      price: '$0',
      period: 'Forever Free',
      features: [
        'Single local repository upload',
        'Interactive SVG call graph',
        'Standard circular dependency check',
        'Basic AI copilot chat'
      ],
      cta: 'Get Started',
      accent: 'border-[#3e4651]/45'
    },
    {
      name: 'Professional',
      price: '$12',
      period: 'per month',
      features: [
        'Multi-repository imports',
        'Complete execution flow traces',
        'Advanced circular dependency visual highlights',
        'Context-augmented AI copilot queries',
        'AST schema export support'
      ],
      cta: 'Start Free Trial',
      accent: 'border-[#00f0ff]/45 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'for teams',
      features: [
        'Unlimited repository imports',
        'Automated CI/CD pull request mapping',
        'Dedicated MongoDB query indexing cluster',
        'SLA guaranteed AI router bandwidth',
        'Priority technical support'
      ],
      cta: 'Contact Sales',
      accent: 'border-[#a855f7]/45'
    }
  ];

  return (
    <div className={`bg-[#040609] text-gray-200 font-mono select-none relative ${isSection ? 'py-16' : 'min-h-screen py-24 px-6'}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-tight">
            Flexible Plans for Every Developer
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-[22px] lg:text-[24px] text-slate-300 font-sans leading-relaxed">
            Choose a plan to visualize your codebase architecture, debug workflows, and scale indices.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, idx) => (
            <Card 
              key={idx}
              title={p.name}
              titleClassName="text-[22px] font-semibold text-white"
              className={`bg-[#0d1117]/60 border flex flex-col justify-between h-full hover:scale-[1.02] transition-transform ${p.accent}`}
              bodyClassName="p-6 flex flex-col gap-6 justify-between flex-grow"
            >
              <div className="space-y-6">
                {/* Price */}
                <div className="space-y-1 font-mono">
                  <span className="text-3xl lg:text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-500 block">{p.period}</span>
                </div>

                {/* Features list */}
                <ul className="space-y-3 font-sans text-[18px] text-slate-300">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-cyan-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="button"
                variant={p.name === 'Professional' ? 'primary' : 'outline'}
                onClick={() => alert(`SaaS pricing dummy simulation: clicked ${p.name}`)}
                className="w-full font-mono text-xs cursor-pointer py-2 border-[#3e4651]"
              >
                {p.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Future Roadmap */}
        <div className="border border-[#1f2937]/35 bg-[#0d1117]/30 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Future Development Roadmap</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              We are working toward integrating the complete backend parser systems. The following features are actively under development:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-slate-300">
            <div className="space-y-2 border-l-2 border-cyan-500/40 pl-4 py-1">
              <h4 className="text-white font-bold">FastAPI Deployments</h4>
              <p className="font-sans text-[11px] leading-relaxed">Migrating local state parsing to remote API ingestion endpoints seamlessly.</p>
            </div>
            <div className="space-y-2 border-l-2 border-[#a855f7]/40 pl-4 py-1">
              <h4 className="text-white font-bold">MongoDB Database Scaling</h4>
              <p className="font-sans text-[11px] leading-relaxed">Enabling persistence of AST schemas and historical dependency maps securely.</p>
            </div>
            <div className="space-y-2 border-l-2 border-emerald-500/40 pl-4 py-1">
              <h4 className="text-white font-bold">Multi-repo Ingestion</h4>
              <p className="font-sans text-[11px] leading-relaxed">Allowing cross-repository package references and internal microservice graph maps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
