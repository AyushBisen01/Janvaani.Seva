
'use client';

import * as React from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { DepartmentPerformanceChart } from '@/components/reports/department-performance-chart';
import { ResolutionFunnelChart } from '@/components/reports/resolution-funnel-chart';
import type { Issue, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const { data: issues, isLoading: isLoadingIssues } = useSWR<Issue[]>('/api/issues');
  const { data: users, isLoading: isLoadingUsers } = useSWR<User[]>('/api/users');

  if (isLoadingIssues || isLoadingUsers || !issues || !users) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 max-w-3xl" />
             <Skeleton className="h-12 w-1/3" />
            <div className="grid gap-6 lg:grid-cols-5">
                <Skeleton className="lg:col-span-3 h-96" />
                <Skeleton className="lg:col-span-2 h-96" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Generate and export detailed reports on civic issues.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
          <CardDescription>
            Select your criteria to generate a downloadable report.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker id="start-date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker id="end-date" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="report-type">Status</Label>
              <Select defaultValue="all">
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Sanitation Dept.">Sanitation</SelectItem>
                  <SelectItem value="Public Works Dept.">Public Works</SelectItem>
                  <SelectItem value="Water Dept.">Water Dept.</SelectItem>
                  <SelectItem value="Electricity Dept.">
                    Electricity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export as CSV
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
        </CardFooter>
      </Card>

      <div>
         <h2 className="text-2xl font-headline font-bold tracking-tight">
          Advanced Analytics
        </h2>
        <p className="text-muted-foreground">
          Deep dive into department performance and issue resolution trends.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentPerformanceChart issues={issues} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Issue Resolution Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResolutionFunnelChart issues={issues} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
