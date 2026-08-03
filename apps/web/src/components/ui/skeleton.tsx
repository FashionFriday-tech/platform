import React from 'react';

import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'border-border/15 bg-background-muted/80 rounded-md border',
        shimmer && 'skeleton-shimmer',
        className,
      )}
      {...props}
    />
  );
}
