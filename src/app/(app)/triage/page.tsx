
'use client';

import * as React from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Check,
  X,
  ShieldAlert,
  Send,
  Eye,
  MoreHorizontal,
  ImageIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { Issue, IssuePriority } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { AssignIssueDialog } from '@/components/issues/assign-issue-dialog';
import { Skeleton } from '@/components/ui/skeleton';

function TriageDataTable({
  issues,
  selectedIssues,
  onSelectedChange,
  onApprove,
  onReject,
  onAssign,
  onView,
}: {
  issues: Issue[];
  selectedIssues: string[];
  onSelectedChange: (id: string, checked: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onAssign: (issue: Issue) => void;
  onView: (id: string) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selectedIssues.length === issues.length && issues.length > 0}
                onCheckedChange={(checked) => {
                  issues.forEach(issue => onSelectedChange(issue.id, !!checked))
                }}
              />
            </TableHead>
            <TableHead>Issue Details</TableHead>
            <TableHead className="hidden md:table-cell">Image</TableHead>
            <TableHead className="hidden md:table-cell">Reported</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => {
            const displayImageUrl = issue.imageUrl;
            return (
            <TableRow key={issue.id} data-state={selectedIssues.includes(issue.id) ? 'selected' : ''}>
              <TableCell>
                <Checkbox 
                  checked={selectedIssues.includes(issue.id)}
                  onCheckedChange={(checked) => onSelectedChange(issue.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{issue.category}</div>
                <div className="text-sm text-muted-foreground">
                  {issue.location.address}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {displayImageUrl ? (
                  <Image
                    src={displayImageUrl}
                    alt={issue.category}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-md">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'secondary' : 'outline'}>{issue.priority}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(issue.id)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {issue.status === 'Pending' && (
                      <>
                        <DropdownMenuItem onClick={() => onApprove(issue.id)}>
                          <Check className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(issue.id)}>
                          <X className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {issue.status === 'Approved' && (
                      <DropdownMenuItem onClick={() => onAssign(issue)}>
                        <Send className="mr-2 h-4 w-4" /> Assign
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}

export default function TriagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: allIssues, mutate, isLoading } = useSWR<Issue[]>('/api/issues');

  const [assignQueue, setAssignQueue] = React.useState<Issue[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);
  const [selectedIssues, setSelectedIssues] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState('pending');

  const updateIssues = async (updates: (Partial<Issue> & { id: string })[]) => {
    const originalIssues = allIssues ? [...allIssues] : [];
    try {
        const updatedIssues = allIssues?.map(issue => {
            const update = updates.find(u => u.id === issue.id);
            return update ? { ...issue, ...update } : issue;
        });

        // Optimistic update
        mutate(updatedIssues, false);
        
        await fetch('/api/issues', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        await mutate();
    } catch(e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: 'Update failed',
            description: 'Could not update issues.',
        });
        mutate(originalIssues, false);
    }
  }


  if (isLoading || !allIssues) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-96 w-full" />
            </CardContent>
        </Card>
    )
  }

  const pendingIssues = allIssues.filter((i) => i.status === 'Pending');
  const approvedIssues = allIssues.filter((i) => i.status === 'Approved');

  const handleApprove = (id: string) => {
    updateIssues([{ id, status: 'Approved' }]);
    toast({ title: "Issue Approved", description: `Issue #${id} has been moved to the auto-approved list.`});
  };

  const handleReject = (id: string) => {
    updateIssues([{ id, status: 'Rejected' }]);
     toast({ title: "Issue Rejected", description: `Issue #${id} has been rejected.`});
  };

  const handleOpenAssignDialog = (issuesToAssign: Issue | Issue[]) => {
    const queue = Array.isArray(issuesToAssign) ? issuesToAssign : [issuesToAssign];
    if (queue.length === 0) {
      toast({ variant: 'destructive', title: "No issues selected", description: "Please select issues to assign."});
      return;
    }
    setAssignQueue(queue);
    setIsAssignDialogOpen(true);
  };

  const handleAssign = (
    ids: string[],
    department: string,
    priority: IssuePriority
  ) => {
    const updates = ids.map(id => ({
        id,
        status: 'Assigned' as const,
        assignedTo: department,
        priority,
    }));
    updateIssues(updates);
    toast({ title: "Issues Assigned", description: `${ids.length} issue(s) have been assigned to ${department}.`});
    setSelectedIssues([]);
  };

  const handleView = (id: string) => {
    router.push(`/issues/${id}`);
  };

  const handleSelectedChange = (id: string, checked: boolean) => {
    setSelectedIssues(prev => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter(issueId => issueId !== id);
      }
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedIssues([]);
  }

  const currentIssues = activeTab === 'pending' ? pendingIssues : approvedIssues;
  const issuesForBulkAssign = allIssues.filter(i => selectedIssues.includes(i.id));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ShieldAlert /> Issue Approval Hub
          </CardTitle>
          <CardDescription>
            Review, approve, and assign new and AI-processed issues to the
            appropriate departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" onValueChange={handleTabChange} value={activeTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="pending">
                  Needs Review ({pendingIssues.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Auto-Approved ({approvedIssues.length})
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleOpenAssignDialog(issuesForBulkAssign)} disabled={selectedIssues.length === 0}>
                  <Send className="mr-2 h-4 w-4" /> Bulk Assign ({selectedIssues.length})
                </Button>
              </div>
            </div>
            <TabsContent value="pending" className="mt-0">
              <TriageDataTable
                issues={pendingIssues}
                selectedIssues={selectedIssues}
                onSelectedChange={handleSelectedChange}
                onApprove={handleApprove}
                onReject={handleReject}
                onAssign={handleOpenAssignDialog}
                onView={handleView}
              />
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              <TriageDataTable
                issues={approvedIssues}
                selectedIssues={selectedIssues}
                onSelectedChange={handleSelectedChange}
                onApprove={handleApprove}
                onReject={handleReject}
                onAssign={handleOpenAssignDialog}
                onView={handleView}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <AssignIssueDialog
        issues={assignQueue}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={handleAssign}
      />
    </>
  );
}

    