'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { mockCustomers } from '../data/mock-customers';
import { mockOrders } from '../../orders/data/mock-orders';
import { mockReviews } from '../data/mock-reviews';
import { ChevronLeftIcon, ShoppingBagIcon, StarIcon } from '@ff/ui';
import Image from 'next/image';

interface CustomerDetailsFeatureProps {
  customerId: string;
}

export function CustomerDetailsFeature({ customerId }: CustomerDetailsFeatureProps) {
  const router = useRouter();
  const customer = mockCustomers.find(c => c.id === customerId);
  const customerOrders = mockOrders.filter(o => o.customer.id === customerId);
  const customerReviews = mockReviews.filter(r => r.customerId === customerId);

  if (!customer) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 rounded-3xl border border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-[#111111]/80">
        <h2 className="text-2xl font-black text-black dark:text-white">Customer Not Found</h2>
        <p className="text-black/60 dark:text-white/60">The customer you are looking for does not exist.</p>
        <button onClick={() => router.push('/customers')} className="mt-4 rounded-xl bg-black px-6 py-3 font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black">
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#111111]">
        {/* Top Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Image width={500} height={500} 
              src={customer.avatar} 
              alt={customer.name} 
              className="h-24 w-24 rounded-2xl object-cover shadow-sm" 
            />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-black dark:text-white">{customer.name}</h1>
                <span className="text-sm text-black/50 dark:text-white/50">
                  <span className={`capitalize ${customer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{customer.status}</span> • Joined {new Date(customer.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="mt-2 flex flex-col gap-3 text-sm text-black/60 dark:text-white/60 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40 dark:text-white/40"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40 dark:text-white/40"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black/40 dark:text-white/40">ID:</span>
                  <span>{customer.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
              <a href={`tel:${customer.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10" title="Call">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
              <a href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20" title="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-black/5 dark:bg-white/5" />

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black/50 dark:text-white/50">Total Orders</span>
            <div className="flex flex-col gap-3">
              <span className="text-3xl font-bold text-black dark:text-white">{customerOrders.length}</span>
              <div className="h-1 w-full rounded-full bg-pink-300 dark:bg-pink-500" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black/50 dark:text-white/50">Total Spent</span>
            <div className="flex flex-col gap-3">
              <span className="text-3xl font-bold text-black dark:text-white">₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <div className="h-1 w-full rounded-full bg-teal-300 dark:bg-teal-500" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black/50 dark:text-white/50">Total Reviews</span>
            <div className="flex flex-col gap-3">
              <span className="text-3xl font-bold text-black dark:text-white">{customerReviews.length}</span>
              <div className="h-1 w-full rounded-full bg-green-300 dark:bg-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Orders Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <ShoppingBagIcon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Orders</h2>
            </div>
            <span className="rounded-full bg-black/5 px-3 py-1 text-sm font-bold dark:bg-white/5">{customerOrders.length} Total</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {customerOrders.length > 0 ? customerOrders.map(order => (
              <div key={order.id} className="group flex cursor-pointer flex-col gap-4 rounded-3xl border border-black/5 bg-white/40 p-6 transition-all hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg hover:shadow-black/5 dark:border-white/5 dark:bg-[#111111]/60 dark:hover:bg-[#1a1a1a]/60">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-black/50 dark:text-white/50">{order.orderNumber}</span>
                    <span className="text-lg font-bold text-black dark:text-white">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' :
                    'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-black/60 dark:text-white/60">
                  <div className="flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-1.5 dark:bg-white/5">
                    <span className="font-semibold text-black dark:text-white">{order.items.length}</span> items
                  </div>
                  <span>•</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                <ShoppingBagIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                <p className="font-semibold text-black/50 dark:text-white/50">No orders placed yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
                <StarIcon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Reviews</h2>
            </div>
            <span className="rounded-full bg-black/5 px-3 py-1 text-sm font-bold dark:bg-white/5">{customerReviews.length} Total</span>
          </div>

          <div className="flex flex-col gap-4">
            {customerReviews.length > 0 ? customerReviews.map(review => (
              <div key={review.id} className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/40 p-6 transition-all hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg hover:shadow-black/5 dark:border-white/5 dark:bg-[#111111]/60 dark:hover:bg-[#1a1a1a]/60">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-black dark:text-white">{review.productName}</span>
                    <span className="text-xs font-medium text-black/40 dark:text-white/40">
                      {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-yellow-500/10 px-3 py-1.5 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
                    <span className="text-sm font-bold">{review.rating}.0</span>
                    <StarIcon className="h-4 w-4 fill-current" />
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">"{review.comment}"</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                <StarIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                <p className="font-semibold text-black/50 dark:text-white/50">No reviews left yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
