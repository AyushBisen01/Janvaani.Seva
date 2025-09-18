
'use client';

import * as React from 'react';
import { issues } from '@/lib/data';
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
  ListFilter,
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

function AssignIssueDialog({
  issue,
  open,
  onOpenChange,
  onAssign,
}: {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (id: string, department: string, priority: IssuePriority) => void;
}) {
  const [department, setDepartment] = React.useState('');
  const [priority, setPriority] = React.useState<IssuePriority | ''>('');

  React.useEffect(() => {
    if (issue) {
      setPriority(issue.priority);
    }
  }, [issue]);

  const handleAssign = () => {
    if (issue && department && priority) {
      onAssign(issue.id, department, priority);
      onOpenChange(false);
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Issue #{issue.id}</DialogTitle>
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
          <Button onClick={handleAssign}>Approve & Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TriageDataTable({
  issues,
  onApprove,
  onReject,
  onAssign,
  onView,
}: {
  issues: Issue[];
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
              <Checkbox />
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
            <TableRow key={issue.id}>
              <TableCell>
                <Checkbox />
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
  const [allIssues, setAllIssues] = React.useState<Issue[]>(issues);
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);

  const pendingIssues = allIssues.filter((i) => i.status === 'Pending');
  const approvedIssues = allIssues.filter((i) => i.status === 'Approved');

  const handleApprove = (id: string) => {
    setAllIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Approved' } : i))
    );
  };

  const handleReject = (id: string) => {
    setAllIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Rejected' } : i))
    );
  };

  const handleOpenAssignDialog = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsAssignDialogOpen(true);
  };

  const handleAssign = (
    id: string,
    department: string,
    priority: IssuePriority
  ) => {
    setAllIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: 'Assigned', assignedTo: department, priority }
          : i
      )
    );
  };

  const handleView = (id: string) => {
    router.push(`/issues/${id}`);
  };

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
          <Tabs defaultValue="pending">
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
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" /> Bulk Assign
                </Button>
              </div>
            </div>
            <TabsContent value="pending" className="mt-0">
              <TriageDataTable
                issues={pendingIssues}
                onApprove={handleApprove}
                onReject={handleReject}
                onAssign={handleOpenAssignDialog}
                onView={handleView}
              />
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              <TriageDataTable
                issues={approvedIssues}
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
        issue={selectedIssue}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={handleAssign}
      />
    </>
  );
}
