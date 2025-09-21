
"use client";

import * as React from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Issue, IssueStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

const statusColors: Record<IssueStatus, string> = {
    Pending: 'text-yellow-500',
    Approved: 'text-blue-500',
    Assigned: 'text-indigo-500',
    inProgress: 'text-indigo-500',
    Resolved: 'text-green-500',
    Rejected: 'text-red-500',
};


export function IssueDetailMap({issue}: {issue: Issue}) {
    const position = issue.location;

    return (
        <div className="h-[400px] w-full overflow-hidden rounded-lg border">
            <Map
                center={position}
                defaultZoom={15}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={'a2a2153c3143f605'}
            >
                <AdvancedMarker position={position}>
                    <MapPin className={cn("h-8 w-8 drop-shadow-lg", statusColors[issue.status])} />
                </AdvancedMarker>
            </Map>
        </div>
    );
}

