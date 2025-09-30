
'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  User,
  MapPin,
  Calendar,
  Layers,
  ShieldAlert,
  HardHat,
  Clock,
  MessageSquare,
  ImageIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MapProvider } from '@/components/map/map-provider';
import { FormattedDate } from '@/components/formatted-date';
import { cn } from '@/lib/utils';
import type { Issue, IssuePriority, IssueStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AssignIssueDialog } from '@/components/issues/assign-issue-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { IssueDetailMap } from '@/components/issues/issue-detail-map';

const statusColors: Record<IssueStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Approved: 'bg-blue-100 text-blue-800 border-blue-200',
    Assigned: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    inProgress: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Resolved: 'bg-green-100 text-green-800 border-green-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const priorityColors: Record<IssuePriority, string> = {
    High: 'bg-accent text-accent-foreground border-yellow-300',
    Medium: 'bg-orange-100 text-orange-800 border-orange-200',
    Low: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function IssueDetailPage() {
  const params = useParams();
  const id = params.id;
  const { toast } = useToast();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);

  const { data: issues, mutate, isLoading } = useSWR<Issue[]>('/api/issues');
  const issue = issues?.find((i) => i.id === id);

  const updateIssue = async (id: string, updates: Partial<Issue>) => {
    const originalIssues = issues;
    // Optimistically update the UI
    const newIssues = issues?.map((i) => (i.id === id ? { ...i, ...updates } : i))
    mutate(newIssues, false);

    try {
      // Make API call to update the issue
      const response = await fetch(`/api/issues`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ id, ...updates }]),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update issue');
      }

      // Trigger a revalidation from server
      await mutate();
    } catch (error) {
      console.error('Failed to update issue:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Could not update the issue.',
      });
      // Rollback optimistic update
      if (originalIssues) mutate(originalIssues, false);
    }
  };

  if (isLoading) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
    </div>
    )
  }

  if (!issue) {
    // SWR hasn't loaded the data yet or issue not found
    if (!isLoading) {
       notFound();
    }
    return null;
  }

  const handleApprove = () => {
    updateIssue(issue.id, { status: 'Approved' });
    toast({ title: "Issue Approved", description: `Issue #${issue.id} has been approved.`});
  }

  const handleReject = () => {
    updateIssue(issue.id, { status: 'Rejected' });
    toast({ title: "Issue Rejected", description: `Issue #${issue.id} has been rejected.`});
  }
  
  const handleAssign = (ids: string[], department: string, priority: IssuePriority) => {
    const issueId = ids[0];
     updateIssue(issueId, { 
        status: 'Assigned', 
        assignedTo: department, 
        priority,
    });
    toast({ title: "Issue Assigned", description: `Issue #${issue.id} has been assigned to ${department}.`});
  };

  const handleNotifyCitizen = () => {
    toast({
      title: 'Citizen Notified',
      description: `A notification has been sent to ${issue.citizen.name}.`,
    });
  };
  
  const issueDetails = [
    { icon: Layers, label: 'Category', value: issue.category },
    { icon: MapPin, label: 'Location', value: issue.location.address },
    { icon: Calendar, label: 'Reported On', value: <FormattedDate date={new Date(issue.reportedAt)} formatStr="PPP p" /> },
    { icon: HardHat, label: 'Assigned To', value: issue.assignedTo || "N/A" },
    { icon: User, label: 'Citizen', value: `${issue.citizen.name} (${issue.citizen.contact})` },
  ];

  const displayImageUrl = issue.imageUrl;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-3xl">Issue #{issue.id}</CardTitle>
                  <CardDescription>{issue.description}</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className={cn("text-sm", priorityColors[issue.priority])}>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    {issue.priority} Priority
                  </Badge>
                  <Badge variant="outline" className={cn("text-sm", statusColors[issue.status])}>
                    <Clock className="mr-2 h-4 w-4" />
                    {issue.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Button size="sm" variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200" onClick={handleApprove} disabled={issue.status !== 'Pending'}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200" onClick={handleReject} disabled={issue.status !== 'Pending'}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button size="sm" disabled={issue.status !== 'Approved'} onClick={() => setIsAssignDialogOpen(true)}>
                  <User className="mr-2 h-4 w-4" /> Assign
                </Button>
                <Button size="sm" variant="secondary" onClick={handleNotifyCitizen}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Notify Citizen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {issueDetails.map(detail => (
                      <div key={detail.label} className="flex items-start">
                          <detail.icon className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
                          <div>
                              <p className="font-semibold">{detail.label}</p>
                              <p className="text-muted-foreground">{detail.value}</p>
                          </div>
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-4">
                      <li className="flex gap-4">
                          <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                              </div>
                          </div>
                          <div>
                              <p className="text-sm">
                                  <span className="font-semibold">{issue.citizen.name}</span> reported the issue.
                              </p>
                              <p className="text-xs text-muted-foreground"><FormattedDate date={new Date(issue.reportedAt)} formatStr="PPP p" /></p>
                          </div>
                      </li>
                      <li className="flex gap-4">
                          <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Check className="h-5 w-5 text-blue-500" />
                              </div>
                          </div>
                          <div>
                              <p className="text-sm">
                                  <span className="font-semibold">AI System</span> automatically approved and categorized the issue.
                              </p>
                              <p className="text-xs text-muted-foreground"><FormattedDate date={new Date(new Date(issue.reportedAt).getTime() + 5 * 60000)} formatStr="PPP p" /></p>
                          </div>
                      </li>
                  </ul>
              </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Issue Media</CardTitle>
            </CardHeader>
            <CardContent>
              {displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt={issue.category}
                  width={800}
                  height={600}
                  className="rounded-lg object-cover"
                  data-ai-hint={issue.imageHint}
                />
              ) : (
                <div className="h-[450px] flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">Annotated image not available.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {issue.proofUrl && issue.resolvedAt && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Proof of Work</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={issue.proofUrl}
                  alt="Proof of work"
                  width={800}
                  height={600}
                  className="rounded-lg object-cover"
                  data-ai-hint={issue.proofHint}
                />
                <p className="text-sm text-muted-foreground mt-2">Work completed on <FormattedDate date={new Date(issue.resolvedAt)} formatStr="PPP" /></p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Location on Map</CardTitle>
            </CardHeader>
            <CardContent>
              <MapProvider>
                <IssueDetailMap issue={issue} />
              </MapProvider>
            </CardContent>
          </Card>
        </div>
      </div>
      <AssignIssueDialog
        issues={[issue]}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={handleAssign}
      />
    </>
  );
}

    