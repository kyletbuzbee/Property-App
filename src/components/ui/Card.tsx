import React from 'react';

import { clsx, type ClassValue } from 'clsx';

import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {

  return twMerge(clsx(inputs));

}

/**

 * Card variants for different use cases

 */

export type CardVariant = 'default' | 'elevated' | 'dark' | 'metric' | 'interactive';

/**

 * Props for the Card component

 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {

  variant?: CardVariant;

  isHoverable?: boolean;

  isPressable?: boolean;

  noPadding?: boolean;

}

/**

 * Card - A flexible card component with multiple variants

 *

 * @example

 * <Card variant="elevated" isHoverable>

 *   <h3>Card Title</h3>

 *   <p>Card content goes here</p>

 * </Card>

 */

export const Card = React.forwardRef<HTMLDivElement, CardProps>(

  ({ className, variant = 'default', isHoverable = false, isPressable = false, noPadding = false, children, ...props }, ref) => {

    const variantStyles = {

      default: 'bg-white border border-slate-200',

      elevated: 'bg-white border border-slate-200 shadow-md',

      dark: 'bg-slate-900 border border-slate-800 text-white',

      metric: 'bg-white border border-slate-200 p-6',

      interactive: 'bg-white border border-slate-200 cursor-pointer',

    };

    const hoverStyles = isHoverable || variant === 'interactive'

      ? 'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-primary-300'

      : '';

    const pressStyles = isPressable || variant === 'interactive'

      ? 'active:scale-[0.99] transition-transform duration-150'

      : '';

    const paddingStyles = noPadding ? '' : 'p-4';

    return (

      <div

        ref={ref}

        className={cn(

          'rounded-sm',

          variantStyles[variant],

          hoverStyles,

          pressStyles,

          paddingStyles,

          className

        )}

        {...props}

      >

        {children}

      </div>

    );

  }

);

Card.displayName = 'Card';

/**

 * CardHeader - Header section for cards

 */

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div

      ref={ref}

      className={cn('flex flex-col space-y-1.5 pb-4 border-b border-slate-100', className)}

      {...props}

    />

  )

);

CardHeader.displayName = 'CardHeader';

/**

 * CardTitle - Title element for cards

 */

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(

  ({ className, ...props }, ref) => (

    <h3

      ref={ref}

      className={cn('text-sm font-bold text-slate-900', className)}

      {...props}

    />

  )

);

CardTitle.displayName = 'CardTitle';

/**

 * CardDescription - Subtitle/description for cards

 */

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(

  ({ className, ...props }, ref) => (

    <p

      ref={ref}

      className={cn('text-[10px] font-bold text-slate-500 uppercase tracking-wider', className)}

      {...props}

    />

  )

);

CardDescription.displayName = 'CardDescription';

/**

 * CardContent - Main content area for cards

 */

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div ref={ref} className={cn('', className)} {...props} />

  )

);

CardContent.displayName = 'CardContent';

/**

 * CardFooter - Footer section for cards

 */

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div

      ref={ref}

      className={cn('flex items-center pt-4 mt-auto border-t border-slate-100', className)}

      {...props}

    />

  )

);

CardFooter.displayName = 'CardFooter';

/**

 * MetricCard - Specialized card for displaying metrics with optional trend

 *

 * @example

 * <MetricCard

 *   label="Total Value"

 *   value="$1,234,567"

 *   trend={+12.5}

 *   trendLabel="vs last month"

 * />

 */

export interface MetricCardProps extends Omit<CardProps, 'variant'> {

  label: string;

  value: string;

  subValue?: string;

  trend?: number;

  trendLabel?: string;

  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';

}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(

  ({ label, value, subValue, trend, trendLabel, variant = 'default', className, ...props }, ref) => {

    const variantStyles = {

      default: 'border-slate-200',

      success: 'border-success/20 bg-success/5',

      warning: 'border-warning/20 bg-warning/5',

      danger: 'border-danger/20 bg-danger/5',

      info: 'border-info/20 bg-info/5',

    };

    const trendColor = trend && trend > 0 ? 'text-success' : trend && trend < 0 ? 'text-danger' : 'text-slate-500';

    return (

      <Card

        ref={ref}

        variant="metric"

        isHoverable

        className={cn(variantStyles[variant], className)}

        {...props}

      >

        <div className="space-y-2">

          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">

            {label}

          </p>

          <p className="text-2xl font-black text-slate-900 tracking-tight">

            {value}

          </p>

          {(subValue || trend !== undefined) && (

            <div className="flex items-center gap-2">

              {subValue && (

                <span className="text-xs font-mono font-bold text-slate-600">

                  {subValue}

                </span>

              )}

              {trend !== undefined && (

                <span className={cn('text-xs font-bold flex items-center gap-1', trendColor)}>

                  {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'} {Math.abs(trend)}%

                  {trendLabel && (

                    <span className="text-slate-400 font-normal">{trendLabel}</span>

                  )}

                </span>

              )}

            </div>

          )}

        </div>

      </Card>

    );

  }

);

MetricCard.displayName = 'MetricCard';

export default Card;