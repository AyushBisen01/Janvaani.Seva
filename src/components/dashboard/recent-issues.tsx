
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { Issue } from '@/lib/types';
import Link from 'next/link';

function FormattedDistanceToNow({ date }: { date: Date }) {
    const [distance, setDistance] = React.useState('');

    React.useEffect(() => {
        setDistance(formatDistanceToNow(date, { addSuffix: true }));
    }, [date]);

    return <>{distance}</>;
}

export function RecentIssues({issues}: {issues: Issue[]}) {
  const recentIssues = issues
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-1">
      {recentIssues.map((issue) => (
        <Link href={`/issues/${issue.id}`} key={issue.id} className="flex items-center p-2 -mx-2 rounded-md hover:bg-muted">
          <Avatar className="h-9 w-9">
             <AvatarImage
              src={`https://i.pravatar.cc/150?u=${issue.citizen.contact}`}
              alt="Avatar"
            />
            <AvatarFallback>
              {issue.citizen.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {issue.category} in {issue.location.address.split(',')[1]}
            </p>
            <p className="text-sm text-muted-foreground">
              {issue.description.substring(0, 40)}...
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            <FormattedDistanceToNow date={new Date(issue.reportedAt)} />
          </div>
        </Link>
      ))}
    </div>
  );
}
