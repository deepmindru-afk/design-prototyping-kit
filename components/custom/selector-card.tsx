'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const selectorCardVariants = cva(
  'relative flex flex-1 cursor-pointer transition-colors duration-200 border border-separator1 hover:bg-bg2',
  {
    variants: {
      size: {
        large: 'flex-col gap-3 p-4 rounded-md',
        small: 'flex-row gap-2 p-3 rounded-lg',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      size: 'large',
      selected: false,
    },
  }
);

export interface SelectorCardProps
  extends VariantProps<typeof selectorCardVariants> {
  value: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}

export const SelectorCard = React.forwardRef<HTMLDivElement, SelectorCardProps>(
  (
    {
      className,
      value,
      title,
      description,
      icon,
      size = 'large',
      selected = false,
      onSelect,
    },
    ref
  ) => {
    const handleClick = () => {
      onSelect?.(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(value);
      }
    };

    return (
      <div
        ref={ref}
        role="radio"
        aria-checked={selected}
        tabIndex={0}
        className={cn(selectorCardVariants({ size, selected }), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {size === 'large' && (
          <div className="flex items-start justify-between flex-1 w-full">
            {icon && (
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 shrink-0 transition-colors duration-200',
                  selected ? '[&_svg]:text-fgAccent1' : '[&_svg]:text-fg2'
                )}
              >
                {icon}
              </div>
            )}
            <div
              className={cn(
                'w-4 h-4 rounded-full border transition-colors duration-200',
                selected
                  ? 'bg-fgAccent1 border-bg1'
                  : 'border-separator2'
              )}
            >
              {selected && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-bg1" />
                </div>
              )}
            </div>
          </div>
        )}

        {size === 'small' && (
          <div className="flex items-start gap-2 w-full">
            <div className="flex-1 flex flex-col gap-0 min-w-0">
              <div className="flex items-center gap-1 w-full">
                <p
                  className={cn(
                    'text-xs font-semibold leading-[1.5] transition-colors duration-200',
                    selected ? 'text-fgAccent1' : 'text-fg0'
                  )}
                >
                  {title}
                </p>
              </div>
              <p
                className={cn(
                  'text-xs font-normal leading-[1.5] transition-colors duration-200',
                  selected ? 'text-fgAccent2' : 'text-fg3'
                )}
              >
                {description}
              </p>
            </div>
            <div
              className={cn(
                'w-4 h-4 rounded-full border transition-colors duration-200 shrink-0',
                selected
                  ? 'bg-fgAccent1 border-bg1'
                  : 'border-separator2'
              )}
            >
              {selected && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-bg1" />
                </div>
              )}
            </div>
          </div>
        )}

        {size === 'large' && (
          <div className="flex flex-col gap-1 items-start w-full">
            <div className="flex items-center gap-1 w-full">
              <p
                className={cn(
                  'text-sm font-semibold leading-[1.5] whitespace-pre transition-colors duration-200',
                  selected ? 'text-fgAccent1' : 'text-fg0'
                )}
              >
                {title}
              </p>
            </div>
            <p
              className={cn(
                'text-sm font-normal leading-[1.5] w-full transition-colors duration-200',
                selected ? 'text-fgAccent2' : 'text-fg3'
              )}
            >
              {description}
            </p>
          </div>
        )}

        {selected && (
          <div
            className={cn(
              'absolute border border-fgAccent1 pointer-events-none transition-opacity duration-200',
              size === 'large' ? '-inset-[3px] rounded-[10px]' : '-inset-[2px] rounded-md'
            )}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

SelectorCard.displayName = 'SelectorCard';

export interface SelectorCardGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export const SelectorCardGroup = React.forwardRef<
  HTMLDivElement,
  SelectorCardGroupProps
>(({ value, onValueChange, children, className, direction = 'horizontal' }, ref) => {
  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const cards = Array.from(
      e.currentTarget.querySelectorAll('[role="radio"]')
    ) as HTMLElement[];
    const currentIndex = cards.findIndex(
      (card) => card === document.activeElement
    );

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % cards.length;
        cards[nextIndex]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = cards.length - 1;
        cards[nextIndex]?.focus();
        break;
    }
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      className={cn(
        'flex gap-3',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<SelectorCardProps>(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onSelect: handleSelect,
          });
        }
        return child;
      })}
    </div>
  );
});

SelectorCardGroup.displayName = 'SelectorCardGroup';

