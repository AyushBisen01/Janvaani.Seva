
"use client";

import * as React from 'react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { Issue, IssueStatus } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { MapPin, X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const statusColors: Record<IssueStatus, string> = {
    Pending: 'text-yellow-500',
    Approved: 'text-blue-500',
    Assigned: 'text-indigo-500',
    'In Progress': 'text-indigo-500',
    Resolved: 'text-green-500',
    Rejected: 'text-red-500',
};

const statusBadgeColors: Record<IssueStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-indigo-100 text-indigo-800',
    'In Progress': 'bg-indigo-100 text-indigo-800',
    Resolved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};


export function InteractiveMap({issues}: {issues: Issue[]}) {
    const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
    const map = useMap();

    React.useEffect(() => {
        if (selectedIssue && map) {
            map.panTo(selectedIssue.location);
        }
    }, [selectedIssue, map]);

     const center = React.useMemo(() => {
        if (issues.length === 0) {
            return { lat: 19.7515, lng: 75.7139 }; // Maharashtra
        }
        const { lat, lng } = issues.reduce(
            (acc, issue) => {
                acc.lat += issue.location.lat;
                acc.lng += issue.location.lng;
                return acc;
            },
            { lat: 0, lng: 0 }
        );
        return { lat: lat / issues.length, lng: lng / issues.length };
    }, [issues]);

    return (
        <div className="h-full w-full">
            <Map
                center={center}
                defaultZoom={7}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={'a2a2153c3143f605'}
            >
                {issues.map((issue) => (
                     <AdvancedMarker 
                        key={issue.id} 
                        position={issue.location} 
                        onClick={() => setSelectedIssue(issue)}
                    >
                         <MapPin className={cn("h-8 w-8 drop-shadow-lg", statusColors[issue.status])} />
                    </AdvancedMarker>
                ))}

                {selectedIssue && (
                    <InfoWindow position={selectedIssue.location} onCloseClick={() => setSelectedIssue(null)}>
                        <div className="p-2 max-w-xs">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg mb-1">{selectedIssue.category}</h3>
                                <button onClick={() => setSelectedIssue(null)} className="p-1 -mr-2 -mt-2"><X className="h-4 w-4" /></button>
                            </div>
                            <p className="text-sm text-muted-foreground">{selectedIssue.location.address}</p>
                            <p className="mt-2 text-sm">{selectedIssue.description}</p>
                            <div className="flex justify-between items-center mt-3">
                                <Badge className={cn(statusBadgeColors[selectedIssue.status])} variant="outline">{selectedIssue.status}</Badge>
                                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                                    <Link href={`/issues/${selectedIssue.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </div>
    );
}
