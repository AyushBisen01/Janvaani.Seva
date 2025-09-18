
'use client';
import * as React from 'react';
import useSWR from 'swr';
import { MapProvider } from "@/components/map/map-provider";
import { InteractiveMap } from "@/components/map/interactive-map";
import type { Issue } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function MapPage() {
    const { data: issues, isLoading } = useSWR<Issue[]>('/api/issues');

    if (isLoading || !issues) {
        return <Skeleton className="h-[calc(100vh-10rem)] w-full -m-4 md:-m-6 lg:-m-8" />
    }

    return (
        <div className="h-[calc(100vh-10rem)] w-full -m-4 md:-m-6 lg:-m-8">
            <MapProvider>
                <InteractiveMap issues={issues} />
            </MapProvider>
        </div>
    );
}
