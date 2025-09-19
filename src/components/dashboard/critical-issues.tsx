
'use client';

import * as React from 'react';
import type { Issue } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

function FormattedDistanceToNow({ date }: { date: Date | string }) {
    const [distance, setDistance] = React.useState('');

    React.useEffect(() => {
        const d = typeof date === 'string' ? new Date(date) : date;
        setDistance(formatDistanceToNow(d, { addSuffix: true }));
    }, [date]);

    return <>{distance}</>;
}


export function CriticalIssues({ issues }: { issues: Issue[] }) {
  const criticalIssues = issues
    .filter((i) => i.priority === 'High' && i.status !== 'Resolved' && i.status !== 'Rejected')
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

  if (criticalIssues.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle className="font-headline font-bold">Critical Issues Requiring Attention ({criticalIssues.length})</AlertTitle>
      <AlertDescription>
        <ScrollArea className="mt-2 space-y-3 h-40">
          {criticalIssues.map((issue) => (
            <div key={issue.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-destructive/10">
              <div className="flex flex-col">
                <Link href={`/issues/${issue.id}`} className="font-semibold hover:underline">
                  {issue.category}: {issue.location.address}
                </Link>
                <p className="text-xs text-destructive/80 dark:text-destructive-foreground/80">
                  Reported <FormattedDistanceToNow date={issue.reportedAt} />
                </p>
              </div>
               <div className="flex items-center gap-2">
                 <Badge variant="outline" className="border-destructive/50 text-destructive">{issue.status}</Badge>
                 <Link href={`/issues/${issue.id}`} title="View Issue">
                    <ExternalLink className="h-4 w-4" />
                </Link>
               </div>
            </div>
          ))}
        </ScrollArea>
        {criticalIssues.length > 3 && (
             <div className="text-center mt-2 border-t border-destructive/20 pt-2">
                <Link href="/issues?priority=High" className="text-sm font-semibold hover:underline">
                    View all {criticalIssues.length} critical issues...
                </Link>
            </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
