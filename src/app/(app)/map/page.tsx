
'use client';
import * as React from 'react';
import useSWR from 'swr';
import { MapProvider } from "@/components/map/map-provider";
import { InteractiveMap } from "@/components/map/interactive-map";
import type { Issue, IssueStatus, IssuePriority } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const legendStatusColors: Record<IssueStatus, string> = {
    Pending: 'bg-yellow-500',
    Approved: 'bg-blue-500',
    Assigned: 'bg-indigo-500',
    'In Progress': 'bg-indigo-500',
    Resolved: 'bg-green-500',
    Rejected: 'bg-red-500',
};

export default function MapPage() {
    const { data: issues, isLoading } = useSWR<Issue[]>('/api/issues');
    
    const [search, setSearch] = React.useState('');
    const [category, setCategory] = React.useState('all');
    const [status, setStatus] = React.useState('all');
    const [priority, setPriority] = React.useState('all');

    const issueCategories = React.useMemo(() => {
        if (!issues) return [];
        const cats = new Set(issues.map(i => i.category));
        return Array.from(cats);
    }, [issues]);

    const filteredIssues = React.useMemo(() => {
        if (!issues) return [];
        return issues.filter(issue => {
            const searchLower = search.toLowerCase();
            const matchesSearch = search === '' || 
                                issue.id.toLowerCase().includes(searchLower) ||
                                issue.location.address.toLowerCase().includes(searchLower) ||
                                issue.description.toLowerCase().includes(searchLower);
            const matchesCategory = category === 'all' || issue.category === category;
            const matchesStatus = status === 'all' || issue.status === status;
            const matchesPriority = priority === 'all' || issue.priority === priority;
            return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
        });
    }, [issues, search, category, status, priority]);


    if (isLoading || !issues) {
        return (
            <div className="flex flex-col gap-4 h-full">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="flex-1 w-full" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full -m-4 md:-m-6 lg:-m-8">
            <div className="p-4 border-b">
                 <CardHeader className="p-0 pb-4">
                    <CardTitle className="font-headline">Map View & Filters</CardTitle>
                </CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                    <Input 
                        placeholder="Search by ID, location, description..." 
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
                     <Select value={priority} onValueChange={(value) => setPriority(value as IssuePriority | 'all')}>
                        <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Separator className="my-4" />
                <div className="flex items-center gap-6 text-sm">
                    <p className="font-semibold">Legend:</p>
                    <div className="flex flex-wrap items-center gap-4">
                        {Object.entries(legendStatusColors).filter(([key]) => key !== 'In Progress').map(([status, colorClass]) => (
                            <div key={status} className="flex items-center gap-2">
                                <span className={cn("h-3 w-3 rounded-full", colorClass)}></span>
                                <span>{status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <MapProvider>
                    <InteractiveMap issues={filteredIssues} />
                </MapProvider>
            </div>
        </div>
    );
}
