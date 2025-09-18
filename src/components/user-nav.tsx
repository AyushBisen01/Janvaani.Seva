

'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Settings, ShieldAlert, User, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { AppContext } from '@/app/(app)/layout';

export function UserNav() {
  const context = React.useContext(AppContext);
  
  if (!context) {
    return null;
  }
  const { issues } = context;

  const pendingIssuesCount = issues.filter(
    (i) => i.status === 'Pending' || i.status === 'Approved'
  ).length;

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {pendingIssuesCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0"
              >
                {pendingIssuesCount}
              </Badge>
            )}
            <span className="sr-only">Pending Issues</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel>
            <p className="font-semibold">Notifications</p>
            <p className="text-xs font-normal text-muted-foreground">
              {pendingIssuesCount > 0
                ? `You have ${pendingIssuesCount} issues needing attention.`
                : 'No new notifications.'}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {pendingIssuesCount > 0 && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/triage">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Go to Issue Approval Hub</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=admin@civic.gov"
                alt="@admin"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Admin User</p>
              <p className="text-xs leading-none text-muted-foreground">
                admin@civic.gov
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/users">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
