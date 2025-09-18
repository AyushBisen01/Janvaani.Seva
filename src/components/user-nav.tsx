
'use client';

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
import { Bell, CreditCard, LogOut, Settings, ShieldAlert, User } from 'lucide-react';
import Link from 'next/link';
import { issues } from '@/lib/data';
import { Badge } from './ui/badge';

export function UserNav() {
  const pendingIssuesCount = issues.filter(
    (i) => i.status === 'Pending'
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
            <p className="font-semibold">Pending Issues</p>
            <p className="text-xs font-normal text-muted-foreground">
              {pendingIssuesCount > 0
                ? 'There are issues waiting for your approval.'
                : 'No issues require your attention.'}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {pendingIssuesCount > 0 && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/triage">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Go to Triage Center</span>
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
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
