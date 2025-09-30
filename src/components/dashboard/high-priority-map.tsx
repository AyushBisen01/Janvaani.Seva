
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
    inProgress: 'text-indigo-500',
    Resolved: 'text-green-500',
    Rejected: 'text-red-500',
};

const statusBadgeColors: Record<IssueStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-indigo-100 text-indigo-800',
    inProgress: 'bg-indigo-100 text-indigo-800',
    Resolved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

// Helper function to calculate distance between two lat/lng points in meters
function haversineDistance(coords1: {lat: number, lng: number}, coords2: {lat: number, lng: number}) {
  const R = 6371e3; // metres
  const φ1 = coords1.lat * Math.PI/180; // φ, λ in radians
  const φ2 = coords2.lat * Math.PI/180;
  const Δφ = (coords2.lat-coords1.lat) * Math.PI/180;
  const Δλ = (coords2.lng-coords1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

const MapCircle = (props: google.maps.CircleOptions) => {
  const map = useMap();
  const circle = React.useRef<google.maps.Circle | null>(null);

  React.useEffect(() => {
    if (!map) return;
    circle.current = new google.maps.Circle({ ...props, map });
    return () => circle.current?.setMap(null);
  }, [map, props]);

  return null;
};


export function HighPriorityMap({issues}: {issues: Issue[]}) {
    const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
    const map = useMap();

    React.useEffect(() => {
        if (selectedIssue && map) {
            map.panTo(selectedIssue.location);
        }
    }, [selectedIssue, map]);

    const highPriorityZones = React.useMemo(() => {
        const highPriorityIssues = issues.filter(i => i.priority === 'High' && i.status !== 'Resolved' && i.status !== 'Rejected');
        const clusters: {lat: number, lng: number}[] = [];
        let visited = new Set<string>();

        function findNeighbors(issue: Issue, currentCluster: Issue[]) {
            visited.add(issue.id);
            currentCluster.push(issue);

            for (const otherIssue of highPriorityIssues) {
                if (!visited.has(otherIssue.id)) {
                    if (haversineDistance(issue.location, otherIssue.location) < 50000) { // 50km radius
                        findNeighbors(otherIssue, currentCluster);
                    }
                }
            }
        }

        for (const issue of highPriorityIssues) {
            if (!visited.has(issue.id)) {
                const currentCluster: Issue[] = [];
                findNeighbors(issue, currentCluster);

                if (currentCluster.length > 1) {
                    const clusterCenter = currentCluster.reduce((acc, i) => {
                        acc.lat += i.location.lat;
                        acc.lng += i.location.lng;
                        return acc;
                    }, {lat: 0, lng: 0});

                    clusterCenter.lat /= currentCluster.length;
                    clusterCenter.lng /= currentCluster.length;
                    clusters.push(clusterCenter);
                }
            }
        }
        return clusters;
    }, [issues]);


    return (
        <Map
            className="h-[400px] w-full rounded-lg border"
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
            defaultZoom={5}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId={'a2a2153c3143f605'}
            fullscreenControl={true}
            rotateControl={true}
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

            {highPriorityZones.map((zone, index) => (
                 <MapCircle
                    key={index}
                    center={zone}
                    radius={50000} // 50km
                    strokeColor="#FF0000"
                    strokeOpacity={0.8}
                    strokeWeight={2}
                    fillColor="#FF0000"
                    fillOpacity={0.15}
                />
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
                                <Link href={`/issues/${selected.id}`}>View Details</Link>
                            </Button>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </Map>
    );
}
