
"use client";

import * as React from 'react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { Issue, IssueStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { MapPin, X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';


const statusColors: Record<IssueStatus, string> = {
    Pending: 'yellow',
    Approved: 'blue',
    Assigned: 'indigo',
    Resolved: 'green',
    Rejected: 'red',
};


export function InteractiveMap({issues}: {issues: Issue[]}) {
    const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
    const [search, setSearch] = React.useState('');
    const [category, setCategory] = React.useState('all');
    const [status, setStatus] = React.useState('all');

    const map = useMap();

    const filteredIssues = React.useMemo(() => issues.filter(issue => {
        const searchLower = search.toLowerCase();
        const matchesSearch = search === '' || 
                            issue.id.toLowerCase().includes(searchLower) ||
                            issue.location.address.toLowerCase().includes(searchLower) ||
                            issue.description.toLowerCase().includes(searchLower);
        const matchesCategory = category === 'all' || issue.category === category;
        const matchesStatus = status === 'all' || issue.status === status;
        return matchesSearch && matchesCategory && matchesStatus;
    }), [issues, search, category, status]);

    const issueCategories = React.useMemo(() => {
        const cats = new Set(issues.map(i => i.category));
        return Array.from(cats);
    }, [issues]);

    React.useEffect(() => {
        if (selectedIssue && map) {
            map.panTo(selectedIssue.location);
        }
    }, [selectedIssue, map]);

    return (
        <div className="h-full w-full relative">
            <div className="absolute top-4 left-4 z-10">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">Filter Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-2">
                         <Input 
                            placeholder="Search..." 
                            className="max-w-xs" 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {issueCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Assigned">Assigned</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
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
                {filteredIssues.map((issue) => (
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
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg mb-1">{selectedIssue.category}</h3>
                                <button onClick={() => setSelectedIssue(null)} className="p-1 -mr-2 -mt-2"><X className="h-4 w-4" /></button>
                            </div>
                            <p className="text-sm text-muted-foreground">{selectedIssue.location.address}</p>
                            <p className="mt-2 text-sm">{selectedIssue.description}</p>
                            <div className="flex justify-between items-center mt-3">
                                <Badge className={cn(`bg-${statusColors[selectedIssue.status]}-100 text-${statusColors[selectedIssue.status]}-800`)} variant="outline">{selectedIssue.status}</Badge>
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
