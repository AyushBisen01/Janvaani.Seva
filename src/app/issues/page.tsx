
'use client';
import * as React from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { IssuesDataTable } from '@/components/issues/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Issue, IssuePriority, IssueStatus } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function IssuesPage() {
  const searchParams = useSearchParams();
  const { data: issues, isLoading } = useSWR<Issue[]>('/api/issues');
  
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState(searchParams.get('status') || 'all');
  const [priority, setPriority] = React.useState(searchParams.get('priority') || 'all');
  
  React.useEffect(() => {
    if (searchParams.has('priority')) {
      setPriority(searchParams.get('priority') || 'all');
    }
     if (searchParams.has('status')) {
      setStatus(searchParams.get('status') || 'all');
    }
  }, [searchParams]);

  if (isLoading || !issues) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-96 w-full" />
            </CardContent>
        </Card>
    )
  }

  const filteredIssues = issues.filter(issue => {
    const searchLower = search.toLowerCase();
    const matchesSearch = search === '' || 
                          issue.id.toLowerCase().includes(searchLower) || 
                          issue.location.address.toLowerCase().includes(searchLower) ||
                          issue.category.toLowerCase().includes(searchLower) ||
                          issue.description.toLowerCase().includes(searchLower);

    const matchesStatus = status === 'all' || issue.status === status;
    const matchesPriority = priority === 'all' || issue.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">
              All Submitted Issues
            </CardTitle>
            <CardDescription>
              View, filter, and manage all reported civic issues.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Input 
            placeholder="Search by ID, location..." 
            className="max-w-sm" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
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
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <IssuesDataTable issues={filteredIssues} />
      </CardContent>
    </Card>
  );
}
