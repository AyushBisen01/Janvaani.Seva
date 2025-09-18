

'use client';

import * as React from 'react';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { Issue, IssuePriority } from '@/lib/types';
import Image from 'next/image';
import { AppContext } from '../layout';
import { useToast } from '@/hooks/use-toast';

function AssignIssueDialog({
  issues,
  open,
  onOpenChange,
  onAssign,
}: {
  issues: Issue[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (ids: string[], department: string, priority: IssuePriority) => void;
}) {
  const [department, setDepartment] = React.useState('');
  const [priority, setPriority] = React.useState<IssuePriority | ''>('');
  const issue = issues[0]; // Use first issue for initial priority

  React.useEffect(() => {
    if (issue) {
      setPriority(issue.priority);
    }
  }, [issue]);

  const handleAssign = () => {
    if (issues.length > 0 && department && priority) {
      onAssign(issues.map(i => i.id), department, priority);
      onOpenChange(false);
    }
  };
  
  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Issue{issues.length > 1 ? `s (${issues.length})` : ` #${issue.id}`}</DialogTitle>
          <DialogDescription>
            Forward this issue to the correct department and set a priority.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={setDepartment} defaultValue={department}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sanitation Dept.">Sanitation</SelectItem>
                <SelectItem value="Public Works Dept.">Public Works</SelectItem>
                <SelectItem value="Water Dept.">Water Department</SelectItem>
                <SelectItem value="Electricity Dept.">
                  Electricity Dept.
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(val) => setPriority(val as IssuePriority)}
              defaultValue={priority}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!department || !priority}>Approve & Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
          {issues.map((issue) => (
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
                <Image
                  src={issue.imageUrl}
                  alt={issue.category}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDistanceToNow(issue.reportedAt, { addSuffix: true })}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function TriagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const context = React.useContext(AppContext);
  const [assignQueue, setAssignQueue] = React.useState<Issue[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);
  const [selectedIssues, setSelectedIssues] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState('pending');

  if (!context) {
    return null;
  }
  const { issues: allIssues, setIssues: setAllIssues } = context;

  const pendingIssues = allIssues.filter((i) => i.status === 'Pending');
  const approvedIssues = allIssues.filter((i) => i.status === 'Approved');

  const handleApprove = (id: string) => {
    setAllIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Approved' } : i))
    );
    toast({ title: "Issue Approved", description: `Issue #${id} has been moved to the auto-approved list.`});
  };

  const handleReject = (id: string) => {
    setAllIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Rejected' } : i))
    );
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
    setAllIssues((prev) =>
      prev.map((i) =>
        ids.includes(i.id)
          ? { ...i, status: 'Assigned', assignedTo: department, priority, statusHistory: [...(i.statusHistory || []), {status: 'Assigned', date: new Date()}] }
          : i
      )
    );
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
