'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { Skeleton } from '../ui/skeleton';

export function MapProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border bg-muted/50 p-4 text-center">
        <p className="mb-2 font-semibold">Map Not Available</p>
        <p className="text-sm text-muted-foreground">
          Google Maps API key is not configured.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Please set{' '}
          <code className="font-mono text-xs">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{' '}
          in your <code className="font-mono text-xs">.env.local</code> file.
        </p>
        <Skeleton className="mt-4 h-[300px] w-full" />
      </div>
    );
  }
  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
}
