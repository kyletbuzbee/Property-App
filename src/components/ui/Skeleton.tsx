import React from 'react';

import { cn } from './Card';

/**

 * Skeleton - Loading placeholder component with shimmer animation

 *

 * @example

 * <Skeleton className="h-24 w-full" />

 * <Skeleton count={3} className="h-4 w-full" />

 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {

  count?: number;

  circle?: boolean;

  shimmer?: boolean;

}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(

  ({ className, count = 1, circle = false, shimmer = true, ...props }, ref) => {

    const baseStyles = 'bg-slate-200 animate-pulse';

    const shapeStyles = circle ? 'rounded-full' : 'rounded-sm';

    const shimmerStyles = shimmer ? 'relative overflow-hidden' : '';

    return (

      <>

        {Array.from({ length: count }).map((_, index) => (

          <div

            key={index}

            ref={index === 0 ? ref : undefined}

            className={cn(baseStyles, shapeStyles, shimmerStyles, className)}

            {...props}

          >

            {shimmer && (

              <div

                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"

                style={{

                  background:

                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',

                }}

              />

            )}

          </div>

        ))}

      </>

    );

  }

);

Skeleton.displayName = 'Skeleton';

/**

 * SkeletonCard - Pre-built skeleton card layout

 */

export const SkeletonCard = React.forwardRef<

  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>

>(({ className, ...props }, ref) => (

  <div

    ref={ref}

    className={cn(

      'bg-white border border-slate-200 rounded-sm p-4',

      className

    )}

    {...props}

  >

    <Skeleton className="h-4 w-1/3 mb-4" />

    <Skeleton className="h-8 w-2/3 mb-2" />

    <Skeleton className="h-4 w-1/2" />

  </div>

));

SkeletonCard.displayName = 'SkeletonCard';

/**

 * SkeletonTable - Pre-built skeleton table layout

 */

export const SkeletonTable = React.forwardRef<

  HTMLDivElement,

  { rows?: number; columns?: number } & React.HTMLAttributes<HTMLDivElement>

>(({ rows = 5, columns = 4, className, ...props }, ref) => (

  <div

    ref={ref}

    className={cn('bg-white border border-slate-200 rounded-sm', className)}

    {...props}

  >

    {/* Header */}

    <div className="flex gap-4 p-4 border-b border-slate-100">

      {Array.from({ length: columns }).map((_, i) => (

        <Skeleton key={i} className="h-4 flex-1" shimmer={false} />

      ))}

    </div>

    {/* Rows */}

    {Array.from({ length: rows }).map((_, rowIndex) => (

      <div key={rowIndex} className="flex gap-4 p-4 border-b border-slate-50">

        {Array.from({ length: columns }).map((_, colIndex) => (

          <Skeleton

            key={colIndex}

            className="h-4 flex-1"

            shimmer={rowIndex < 3}

          />

        ))}

      </div>

    ))}

  </div>

));

SkeletonTable.displayName = 'SkeletonTable';

/**

 * SkeletonText - Pre-built skeleton text layout

 */

export const SkeletonText = React.forwardRef<

  HTMLDivElement,

  { lines?: number } & React.HTMLAttributes<HTMLDivElement>

>(({ lines = 3, className, ...props }, ref) => (

  <div ref={ref} className={cn('space-y-2', className)} {...props}>

    {Array.from({ length: lines }).map((_, i) => (

      <Skeleton

        key={i}

        className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}

        shimmer={i < 2}

      />

    ))}

  </div>

));

SkeletonText.displayName = 'SkeletonText';

export default Skeleton;
