'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeContentProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeContent({ children, className = '', delay = 0 }: FadeContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasBeenVisibleRef = useRef(false);

  useEffect(() => {
    if (hasBeenVisibleRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasBeenVisibleRef.current) {
          hasBeenVisibleRef.current = true;
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 },
    );

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  // Opacity stays at 1 under prefers-reduced-motion so contrast checks (and users who
  // asked for less motion) never see the in-between fade colors.
  const motionClass = isVisible
    ? 'translate-y-0 opacity-100'
    : 'motion-safe:translate-y-10 motion-safe:opacity-0';

  return (
    <div
      ref={ref}
      className={`motion-safe:transition-[transform,opacity] motion-safe:duration-1000 ${motionClass} ${className}`}
    >
      {children}
    </div>
  );
}
