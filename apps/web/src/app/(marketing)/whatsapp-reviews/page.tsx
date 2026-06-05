import React from 'react';

import { WhatsAppReviewsClient } from './WhatsAppReviewsClient';

export default async function WhatsAppReviewsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  let initialReviews = [];
  try {
    const res = await fetch(`${API_URL}/whatsapp-reviews?limit=20&offset=0`, {
      next: { revalidate: 86400, tags: ['home-reviews'] },
    });
    if (res.ok) {
      initialReviews = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch initial reviews on server:', err);
  }

  return (
    <div className="bg-background min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
            WhatsApp Customer Reviews
          </h1>
          <p className="text-foreground-muted mx-auto mt-4 max-w-2xl text-lg">
            See actual feedback and chats from our verified shoppers across India.
          </p>
        </div>

        <WhatsAppReviewsClient initialReviews={initialReviews} />
      </div>
    </div>
  );
}
