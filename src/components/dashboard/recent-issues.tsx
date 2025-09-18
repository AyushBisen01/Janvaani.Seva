import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { issues } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

export function RecentIssues() {
  const recentIssues = issues
    .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {recentIssues.map((issue) => (
        <div key={issue.id} className="flex items-center">
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
            {formatDistanceToNow(issue.reportedAt, { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
}
