'use client';

import React, { useState } from 'react';
import { SparklesIcon } from '@ff/ui';

export default function HomeFeedbackSection() {
  const [type, setType] = useState('suggestion');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 5) {
      setError('Please provide a description with at least 5 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description, email }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback.');
      }

      setSuccess('Thank you! Your feedback has been received.');
      setDescription('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-16 flex items-center justify-center px-4 md:px-8">
      <div className="bg-zinc-950 text-white w-full max-w-6xl overflow-hidden rounded-[2.5rem] lg:flex lg:items-stretch lg:justify-between border border-white/10 shadow-2xl">
        {/* Left Visual Card */}
        <div className="relative hidden min-h-[450px] lg:flex flex-col justify-end p-12 overflow-hidden rounded-l-[2.5rem] flex-1 bg-black">
          <div className="absolute inset-0 bg-radial-to-br from-zinc-800 to-black opacity-95" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
              <SparklesIcon className="text-xl text-white" />
            </div>
            <h4 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">
              Help Us <br />
              <span className="text-[#FF0000]">Improve.</span>
            </h4>
            <p className="max-w-xs text-sm text-zinc-400 font-medium">
              Your feedback shapes Fashion Friday. Report issues, suggest features, or share your shopping experience.
            </p>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="flex flex-col justify-center p-8 lg:p-16 flex-1 bg-zinc-950">
          <h3 className="text-white text-3xl font-black uppercase mb-2">Feedback & suggestions</h3>
          <p className="text-zinc-400 text-sm font-medium mb-8">
            Tell us what is on your mind. We read every submission.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-start">
            {success && (
              <div className="rounded-2xl bg-green-500/10 p-4 border border-green-500/20">
                <p className="text-xs font-bold tracking-wider text-green-500 uppercase">{success}</p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-[#FF0000]/10 p-4 border border-[#FF0000]/20">
                <p className="text-xs font-bold tracking-wider text-[#FF0000] uppercase">{error}</p>
              </div>
            )}

            {/* Type selector */}
            <div className="flex flex-col">
              <label className="text-zinc-400 mb-3 px-1 text-[10px] font-black tracking-[0.2em] uppercase">
                Feedback Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['suggestion', 'issue', 'improvement', 'other'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                      type === t
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white border-white/20 hover:border-white/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-zinc-400 mb-2 px-1 text-[10px] font-black tracking-[0.2em] uppercase">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-white text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            {/* Message Description */}
            <div className="flex flex-col">
              <label className="text-zinc-400 mb-2 px-1 text-[10px] font-black tracking-[0.2em] uppercase">
                Your Message
              </label>
              <textarea
                rows={4}
                placeholder="What can we do better?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-white text-white placeholder:text-zinc-600 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black hover:bg-white/90 group mt-4 flex w-full items-center justify-center rounded-full px-10 py-4.5 font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
