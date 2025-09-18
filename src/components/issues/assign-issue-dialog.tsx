
'use client';

import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import type { Issue, IssuePriority } from '@/lib/types';

export function AssignIssueDialog({
  issues,
  open,
  onOpenChange,
  onAssign,
}: {
  issues: Issue[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (
    ids: string[],
    department: string,
    priority: IssuePriority
  ) => void;
}) {
  const [department, setDepartment] = React.useState('');
  const [priority, setPriority] = React.useState<IssuePriority | ''>('');
  const issue = issues[0]; 

  React.useEffect(() => {
    if (issue) {
      setPriority(issue.priority);
    }
  }, [issue]);

  const handleAssign = () => {
    if (issues.length > 0 && department && priority) {
      onAssign(
        issues.map((i) => i.id),
        department,
        priority
      );
      onOpenChange(false);
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign Issue{issues.length > 1 ? `s (${issues.length})` : ` #${issue.id}`}
          </DialogTitle>
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
          <Button onClick={handleAssign} disabled={!department || !priority}>
            Approve & Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
