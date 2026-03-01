
/**

 * Badge - Status and label component with multiple variants

 *

 * @example

 * <Badge variant="success">PASS</Badge>

 * <Badge variant="danger" pulse>Critical</Badge>

 * <Badge variant="info" size="lg">Info Label</Badge>

 */

import React from 'react';

import { cn } from './Card';

export type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'caution' | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {

  variant?: BadgeVariant;

  size?: BadgeSize;

  pulse?: boolean;

  rounded?: boolean;

  outline?: boolean;

}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(

  (

    {

      className,

      variant = 'default',

      size = 'sm',

      pulse = false,

      rounded = false,

      outline = false,

      children,

      ...props

    },

    ref

  ) => {

    const variantStyles: Record<BadgeVariant, string> = {

      default: outline

        ? 'border-slate-300 text-slate-700'

        : 'bg-slate-100 text-slate-700 border-slate-200',

      success: outline

        ? 'border-success/30 text-success'

        : 'bg-success/10 text-success border-success/20',

      danger: outline

        ? 'border-danger/30 text-danger'

        : 'bg-danger/10 text-danger border-danger/20',

      warning: outline

        ? 'border-warning/30 text-warning'

        : 'bg-warning/10 text-warning border-warning/20',

      info: outline

        ? 'border-info/30 text-info'

        : 'bg-info/10 text-info border-info/20',

      caution: outline

        ? 'border-caution/30 text-caution'

        : 'bg-caution/10 text-caution border-caution/20',

      neutral: outline

        ? 'border-slate-400 text-slate-600'

        : 'bg-slate-200 text-slate-700 border-slate-300',

    };

    const sizeStyles: Record<BadgeSize, string> = {

      sm: 'px-2 py-0.5 text-[10px]',

      md: 'px-2.5 py-1 text-xs',

      lg: 'px-3 py-1.5 text-sm',

    };

    return (

      <span

        ref={ref}

        className={cn(

          'inline-flex items-center font-semibold uppercase tracking-tight border',

          rounded ? 'rounded-full' : 'rounded-sm',

          variantStyles[variant],

          sizeStyles[size],

          pulse && 'animate-pulse',

          className

        )}

        {...props}

      >

        {children}

      </span>

    );

  }

);

Badge.displayName = 'Badge';

/**

 * DecisionBadge - Specialized badge for property decisions

 */

export type Decision = 'PASS' | 'CAUTION' | 'HARD_FAIL';

export interface DecisionBadgeProps extends Omit<BadgeProps, 'variant'> {

  decision: Decision;

}

export const DecisionBadge = React.forwardRef<HTMLSpanElement, DecisionBadgeProps>(

  ({ decision, className, ...props }, ref) => {

    const variantMap: Record<Decision, BadgeVariant> = {

      PASS: 'success',

      CAUTION: 'warning',

      HARD_FAIL: 'danger',

    };

    return (

      <Badge ref={ref} variant={variantMap[decision]} className={className} {...props}>

        {decision.replace('_', ' ')}

      </Badge>

    );

  }

);

DecisionBadge.displayName = 'DecisionBadge';

/**

 * StatusIndicator - Dot-style status indicator

 */

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {

  status: 'online' | 'offline' | 'away' | 'busy';

  size?: 'sm' | 'md' | 'lg';

  pulse?: boolean;

  label?: string;

}

export const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(

  ({ status, size = 'md', pulse = false, label, className, ...props }, ref) => {

    const statusColors = {

      online: 'bg-success',

      offline: 'bg-slate-400',

      away: 'bg-warning',

      busy: 'bg-danger',

    };

    const sizeStyles = {

      sm: 'w-2 h-2',

      md: 'w-2.5 h-2.5',

      lg: 'w-3 h-3',

    };

    return (

      <span ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props}>

        <span

          className={cn(

            'rounded-full',

            sizeStyles[size],

            statusColors[status],

            pulse && status === 'online' && 'animate-pulse'

          )}

        />

        {label && (

          <span className="text-xs font-medium text-slate-600">

            {label}

          </span>

        )}

      </span>

    );

  }

);

StatusIndicator.displayName = 'StatusIndicator';

/**

 * CountBadge - Small badge for displaying counts

 */

export interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {

  count: number;

  max?: number;

  size?: 'sm' | 'md';

  variant?: BadgeVariant;

}

export const CountBadge = React.forwardRef<HTMLSpanElement, CountBadgeProps>(

  ({ count, max = 99, size = 'sm', variant = 'neutral', className, ...props }, ref) => {

    const displayCount = count > max ? `${max}+` : count;

    const sizeStyles = {

      sm: 'min-w-[18px] h-[18px] text-[10px]',

      md: 'min-w-[22px] h-[22px] text-xs',

    };

    return (

      <span

        ref={ref}

        className={cn(

          'inline-flex items-center justify-center font-black rounded-full',

          sizeStyles[size],

          variant === 'danger' && 'bg-danger text-white',

          variant === 'success' && 'bg-success text-white',

          variant === 'warning' && 'bg-warning text-white',

          variant === 'info' && 'bg-info text-white',

          variant === 'neutral' && 'bg-slate-900 text-white',

          className

        )}

        {...props}

      >

        {displayCount}

      </span>

    );

  }

);

CountBadge.displayName = 'CountBadge';

export default Badge;
