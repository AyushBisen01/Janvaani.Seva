"use client";

import { useState } from 'react';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { issues } from '@/lib/data';
import type { Issue, IssueStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';


const statusColors: Record<IssueStatus, string> = {
    Pending: 'yellow',
    Approved: 'blue',
    Assigned: 'indigo',
    Resolved: 'green',
    Rejected: 'red',
};


export function InteractiveMap() {
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    return (
        <div className="h-full w-full relative">
            <div className="absolute top-4 left-4 z-10">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline">Filter Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                         <Input placeholder="Search..." className="max-w-xs" />
                          <Select>
                            <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="pothole">Pothole</SelectItem>
                            <SelectItem value="garbage">Garbage</SelectItem>
                            <SelectItem value="water">Water Leakage</SelectItem>
                            <SelectItem value="light">Streetlight</SelectItem>
                            </SelectContent>
                        </Select>
                          <Select>
                            <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>
            <Map
                defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
                defaultZoom={12}
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
                         <MapPin className={cn("h-8 w-8", `text-${statusColors[issue.status]}-500`)} />
                    </AdvancedMarker>
                ))}

                {selectedIssue && (
                    <InfoWindow position={selectedIssue.location} onCloseClick={() => setSelectedIssue(null)}>
                        <div className="p-2 max-w-xs">
                            <h3 className="font-bold text-lg">{selectedIssue.category}</h3>
                            <p className="text-sm text-muted-foreground">{selectedIssue.location.address}</p>
                            <p className="mt-2 text-sm">{selectedIssue.description}</p>
                            <Badge className="mt-2" variant="outline">{selectedIssue.status}</Badge>
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </div>
    );
}
