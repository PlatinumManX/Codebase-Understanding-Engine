import React, { useState } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { useToast } from '../../../shared/context/ToastContext';

export default function ContactPage({ isSection = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    showToast('success', 'Message Sent Successfully! (Dummy submission)');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className={`bg-[#040609] text-gray-200 font-mono select-none relative ${isSection ? 'py-16' : 'min-h-screen py-24 px-6'}`}>
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Intro */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-tight">
            Connect With Our Team
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-[22px] lg:text-[24px] text-slate-300 font-sans leading-relaxed">
            Have questions about parser setups, AST extensions, or future integrations? Get in touch.
          </p>
        </div>

        {/* Split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Column: Contact cards */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Project Information</h2>
              <p className="text-slate-300 font-sans text-sm leading-relaxed">
                CodeMap AI is open-source. For corporate integration guidelines or feedback on the circular parsing algorithms, reach out through the channels below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card title="Team Coordinator" titleClassName="text-[22px] font-semibold text-white" className="bg-[#161b22]/30 border-[#3e4651]/45">
                <div className="space-y-2 text-[18px] font-mono">
                  <p className="text-slate-400">Coordinator Email:</p>
                  <p className="text-[#00f0ff] font-bold">gupta.rajesh@codemap.ai</p>
                  <p className="text-slate-500 mt-2 text-[15px]">Office Coordinates:<br />Block 4, CE Department</p>
                </div>
              </Card>
              <Card title="Student Developers" titleClassName="text-[22px] font-semibold text-white" className="bg-[#161b22]/30 border-[#3e4651]/45">
                <div className="space-y-2 text-[18px] font-mono">
                  <p className="text-slate-400">Student Leads:</p>
                  <p className="text-gray-200">Rajesh.k@codemap.ai</p>
                  <p className="text-gray-200">priya.s@codemap.ai</p>
                  <p className="text-slate-500 mt-1 text-[15px]">Academic Year: 2025-2026</p>
                </div>
              </Card>
            </div>

            <div className="border border-[#3e4651]/30 bg-[#0d1117]/30 rounded-2xl p-6 font-mono text-xs text-slate-400 space-y-2 select-none">
              <p className="font-bold text-white">College Affiliation:</p>
              <p>LDRP Institute of Technology and Research</p>
              <p>Department of Computer Engineering</p>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <Card title="Send Message" titleClassName="text-[22px] font-semibold text-white" className="bg-[#0d1117]/60 border-[#3e4651]/55">
            <form onSubmit={handleSubmit} className="space-y-4 p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  id="name"
                  type="text"
                  placeholder="e.g. Vrijesh Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="e.g. mpr_dev@codemap.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />
              </div>

              <Input
                label="Subject"
                id="subject"
                type="text"
                placeholder="e.g. AST Circular Import question"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                error={errors.subject}
                required
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="message" className="text-xs font-medium text-gray-300">
                  Message Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Type your message details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full bg-[#0d1117] text-gray-200 text-sm border rounded-md py-2.5 px-3.5 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] focus:border-[#00f0ff] placeholder-gray-600 ${
                    errors.message ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500' : 'border-[#30363d]'
                  }`}
                />
                {errors.message && (
                  <span className="text-xs text-red-400 mt-0.5">{errors.message}</span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-mono text-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] border-[#00f0ff]/40"
              >
                Submit Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
