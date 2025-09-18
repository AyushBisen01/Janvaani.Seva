
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
import {
  Check,
  X,
  User,
  ShieldAlert,
  Send,
  Eye,
  ListFilter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { Issue } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  onAssign: (id: string) => void;
  onView: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issue</TableHead>
          <TableHead>Reported</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>
              <div className="font-medium">{issue.category}</div>
              <div className="text-sm text-muted-foreground">
                {issue.location.address}
              </div>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(issue.reportedAt, { addSuffix: true })}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onView(issue.id)}
                >
                  <Eye className="mr-2 h-4 w-4" /> View
                </Button>
                {issue.status === 'Pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                      onClick={() => onApprove(issue.id)}
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onReject(issue.id)}
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
                {issue.status === 'Approved' && (
                  <Button size="sm" onClick={() => onAssign(issue.id)}>
                    <Send className="mr-2 h-4 w-4" /> Assign
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function TriagePage() {
  const router = useRouter();
  const [allIssues, setAllIssues] = React.useState<Issue[]>(issues);

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
  const handleAssign = (id: string) => {
    setAllIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'Assigned', assignedTo: 'PWD' } : i
      )
    );
  };
  const handleView = (id: string) => {
    router.push(`/issues/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <ShieldAlert /> Issue Triage
        </CardTitle>
        <CardDescription>
          Review, approve, and assign new and AI-processed issues to the
          appropriate departments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="pending">
                Needs Review ({pendingIssues.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Auto-Approved ({approvedIssues.length})
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <TriageDataTable
                  issues={pendingIssues}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAssign={handleAssign}
                  onView={handleView}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <TriageDataTable
                  issues={approvedIssues}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAssign={handleAssign}
                  onView={handleView}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

