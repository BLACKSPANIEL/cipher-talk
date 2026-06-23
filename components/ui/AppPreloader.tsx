'use client';

import { useState, useEffect } from 'react';
import { Preloader } from '@/components/ui/Preloader';

export function AppPreloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const complete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    if (document.readyState === 'complete') {
      complete();
    } else {
      window.addEventListener('load', complete);
      return () => window.removeEventListener('load', complete);
    }
  }, []);

  return (
    <>
      <Preloader isLoading={isLoading} />
      {children}
    </>
  );
}

export default AppPreloader;