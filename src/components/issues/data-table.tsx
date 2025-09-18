'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Issue, IssuePriority, IssueStatus } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface IssuesDataTableProps {
  issues: Issue[];
}

const statusColors: Record<IssueStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Approved: 'bg-blue-100 text-blue-800 border-blue-200',
  Assigned: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Resolved: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const priorityColors: Record<IssuePriority, string> = {
  High: 'bg-accent text-accent-foreground border-yellow-300',
  Medium: 'bg-orange-100 text-orange-800 border-orange-200',
  Low: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function IssuesDataTable({ issues }: IssuesDataTableProps) {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/issues/${id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported On</TableHead>
            <TableHead>Assigned To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow
              key={issue.id}
              onClick={() => handleRowClick(issue.id)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{issue.id}</TableCell>
              <TableCell>{issue.category}</TableCell>
              <TableCell>{issue.location.address}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn('font-semibold', priorityColors[issue.priority])}
                >
                  {issue.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(statusColors[issue.status])}
                >
                  {issue.status}
                </Badge>
              </TableCell>
              <TableCell>{format(issue.reportedAt, 'PPP')}</TableCell>
              <TableCell>{issue.assignedTo || 'Unassigned'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
