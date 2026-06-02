'use client';

import React from 'react';
import Image from 'next/image';

import { useProductRequests } from '../hooks/useProductRequests';

export function ProductRequestsFeature() {
  const { requests, isLoading, refreshRequests } = useProductRequests();

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Sourcing Requests</h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            Monitor and manage custom products requested by customers.
          </p>
        </div>
        <button
          onClick={refreshRequests}
          disabled={isLoading}
          className="rounded-full bg-black px-6 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {isLoading ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-3xl border border-dashed">
          <div className="text-center">
            <p className="text-lg font-bold text-black/40 uppercase dark:text-white/40">
              No Sourcing Requests Filed Yet
            </p>
            <p className="text-sm text-black/30 dark:text-white/30">
              User requests will show up here automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="group bg-card overflow-hidden rounded-3xl border transition-all hover:shadow-lg"
            >
              {/* Product Sourcing Image Wrapper */}
              <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={request.imageUrl}
                  alt={request.productName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Card Meta Content Info */}
              <div className="space-y-4 p-5">
                <div>
                  <span className="text-destructive text-[9px] font-black tracking-widest uppercase">
                    Custom Sourcing
                  </span>
                  <h4 className="truncate text-base font-black tracking-tight uppercase">
                    {request.productName}
                  </h4>
                </div>

                <div className="space-y-1.5 border-t pt-3 text-xs">
                  <div>
                    <span className="font-bold text-black/55 dark:text-white/55">Customer: </span>
                    <span className="font-medium text-black dark:text-white">
                      {request.user?.name || 'Anonymous'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-black/55 dark:text-white/55">Contact: </span>
                    <a
                      href={`tel:${request.user?.phone}`}
                      className="text-destructive font-medium hover:underline"
                    >
                      {request.user?.phone || 'N/A'}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-black/55 dark:text-white/55">Email: </span>
                    <span className="block truncate font-medium text-black dark:text-white">
                      {request.user?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="pt-1 text-[10px] text-black/40 dark:text-white/40">
                    Filed on {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
