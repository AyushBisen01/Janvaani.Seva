

'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ListChecks,
  Map,
  BarChart2,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/triage', icon: ShieldAlert, label: 'Issue Approval' },
  { href: '/issues', icon: ListChecks, label: 'All Issues' },
  { href: '/map', icon: Map, label: 'Map View' },
  { href: '/reports', icon: BarChart2, label: 'Reports' },
  { href: '/users', icon: Users, label: 'User Management' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard Overview',
  '/triage': 'Issue Approval Hub',
  '/issues': 'All Issues',
  '/map': 'Interactive Map',
  '/reports': 'Analytics & Reports',
  '/users': 'User Management',
  '/settings': 'System Settings',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const getPageTitle = () => {
    if (pathname.startsWith('/issues/')) return 'Issue Details';
    return pageTitles[pathname] || 'CivicMonitor';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <ShieldAlert className="size-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-primary">
              CivicMonitor
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Logout' }}>
                  <Link href="/login">
                    <LogOut />
                    <span className="truncate">Logout</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <PageHeader title={getPageTitle()}>
          <UserNav />
        </PageHeader>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
