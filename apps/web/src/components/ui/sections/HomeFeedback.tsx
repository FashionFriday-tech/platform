'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
    <div className="my-24 py-12 md:py-20 flex items-center justify-center px-4 md:px-8">
      <div className="w-full max-w-6xl lg:flex lg:items-stretch lg:justify-between gap-8">
        
        {/* Left Box - Image Card */}
        <div className="group relative hidden min-h-[500px] lg:block overflow-hidden rounded-[2.5rem] flex-1 border border-white/10 shadow-2xl">
          {/* Sourcing/Feedback Image */}
          <Image
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop"
            alt="Customer Feedback Service"
            fill
            className="object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          {/* Deep Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95 transition-opacity duration-500" />

          {/* Crossed Banner 1 */}
          <div className="absolute w-[180%] top-[30%] -left-[40%] -rotate-12 bg-black/85 backdrop-blur-md py-3 border-y border-white/10 select-none pointer-events-none whitespace-nowrap overflow-hidden z-10 flex">
            <div className="animate-marquee flex w-max gap-8 px-4 text-white text-[10px] font-black tracking-[0.3em] uppercase">
              {Array(8).fill('SHARE YOUR EXPERIENCE • ').map((text, i) => (
                <span key={i} className="flex items-center gap-2">
                  {text}
                  <span className="bg-[#FF0000] h-1.5 w-1.5 rounded-full shrink-0" />
                </span>
              ))}
            </div>
          </div>

          {/* Crossed Banner 2 */}
          <div className="absolute w-[180%] bottom-[30%] -left-[40%] rotate-6 bg-[#FF0000] py-3 border-y border-white/20 select-none pointer-events-none whitespace-nowrap overflow-hidden z-10 flex">
            <div className="animate-marquee flex w-max gap-8 px-4 text-white text-[10px] font-black tracking-[0.3em] uppercase">
              {Array(8).fill('HELP US DEFINE FASHION • ').map((text, i) => (
                <span key={i} className="flex items-center gap-2">
                  {text}
                  <span className="bg-white h-1.5 w-1.5 rounded-full shrink-0" />
                </span>
              ))}
            </div>
          </div>

          {/* Content Info overlay */}
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <p className="text-[#FF0000] mb-2 text-xs font-bold tracking-[0.4em] uppercase">
              Co-Creation Node
            </p>
            <h4 className="text-white text-4xl font-black tracking-tighter uppercase leading-none">
              Help Us <br /> Improve.
            </h4>
          </div>
        </div>

        {/* Right Box - Form Card */}
        <div className="flex flex-col justify-center p-8 lg:p-16 flex-1 bg-zinc-950 rounded-[2.5rem] border border-white/10 shadow-2xl">
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
