import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trackPageView } from '../lib/analyticsUtils';

export function usePageTracking() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    trackPageView(pathname, session?.user);
  }, [pathname, session]);
}