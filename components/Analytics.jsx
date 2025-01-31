'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { trackPageView } from '../lib/analyticsUtils';

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    trackPageView(pathname, session?.user);
  }, [pathname, session]);

  return null;
}