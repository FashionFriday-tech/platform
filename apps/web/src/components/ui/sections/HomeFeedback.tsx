'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
    <div className="my-24 flex items-center justify-center px-4 py-12 md:px-8 md:py-20">
      <div className="w-full max-w-6xl gap-8 lg:flex lg:items-stretch lg:justify-between">
        {/* Left Box - Image Card */}
        <div className="group relative hidden min-h-[500px] flex-1 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl lg:block">
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
          <div className="pointer-events-none absolute top-[30%] -left-[40%] z-10 flex w-[180%] -rotate-12 overflow-hidden border-y border-white/10 bg-black/85 py-3 whitespace-nowrap backdrop-blur-md select-none">
            <div className="animate-marquee flex w-max gap-8 px-4 text-[10px] font-black tracking-[0.3em] text-white uppercase">
              {Array(8)
                .fill('SHARE YOUR EXPERIENCE • ')
                .map((text, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {text}
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF0000]" />
                  </span>
                ))}
            </div>
          </div>

          {/* Crossed Banner 2 */}
          <div className="pointer-events-none absolute bottom-[30%] -left-[40%] z-10 flex w-[180%] rotate-6 overflow-hidden border-y border-white/20 bg-[#FF0000] py-3 whitespace-nowrap select-none">
            <div className="animate-marquee flex w-max gap-8 px-4 text-[10px] font-black tracking-[0.3em] text-white uppercase">
              {Array(8)
                .fill('HELP US DEFINE FASHION • ')
                .map((text, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {text}
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  </span>
                ))}
            </div>
          </div>

          {/* Content Info overlay */}
          <div className="absolute right-12 bottom-12 left-12 z-20">
            <p className="mb-2 text-xs font-bold tracking-[0.4em] text-[#FF0000] uppercase">
              Co-Creation Node
            </p>
            <h4 className="text-4xl leading-none font-black tracking-tighter text-white uppercase">
              Help Us <br /> Improve.
            </h4>
          </div>
        </div>

        {/* Right Box - Form Card */}
        <div className="flex flex-1 flex-col justify-center rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl lg:p-16">
          <h3 className="mb-2 text-3xl font-black text-white uppercase">Feedback & suggestions</h3>
          <p className="mb-8 text-sm font-medium text-zinc-400">
            Tell us what is on your mind. We read every submission.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-start">
            {success && (
              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                <p className="text-xs font-bold tracking-wider text-green-500 uppercase">
                  {success}
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-[#FF0000]/20 bg-[#FF0000]/10 p-4">
                <p className="text-xs font-bold tracking-wider text-[#FF0000] uppercase">{error}</p>
              </div>
            )}

            {/* Type selector */}
            <div className="flex flex-col">
              <label className="mb-3 px-1 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
                Feedback Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['suggestion', 'issue', 'improvement', 'other'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                    }}
                    className={`rounded-full border px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
                      type === t
                        ? 'border-white bg-white text-black'
                        : 'border-white/20 bg-transparent text-white hover:border-white/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col">
              <label className="mb-2 px-1 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white transition-colors outline-none placeholder:text-zinc-600 focus:border-white"
              />
            </div>

            {/* Message Description */}
            <div className="flex flex-col">
              <label className="mb-2 px-1 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
                Your Message
              </label>
              <textarea
                rows={4}
                placeholder="What can we do better?"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white transition-colors outline-none placeholder:text-zinc-600 focus:border-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-4 flex w-full items-center justify-center rounded-full bg-white px-10 py-4.5 font-black tracking-widest text-black uppercase transition-all hover:bg-white/90 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
