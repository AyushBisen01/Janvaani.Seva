
'use client';

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
import { FileDown, BarChart2 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className='space-y-2'>
            <h1 className="text-3xl font-headline font-bold tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate and export reports on civic issues.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Generate Issue Report</CardTitle>
              <CardDescription>
                Create a CSV report based on a date range and filters.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select defaultValue="all-issues">
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-issues">All Issues</SelectItem>
                    <SelectItem value="resolved-issues">
                      Resolved Issues
                    </SelectItem>
                    <SelectItem value="pending-issues">
                      Pending Issues
                    </SelectItem>
                    <SelectItem value="by-category">By Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <DatePicker id="start-date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <DatePicker id="end-date" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <FileDown className="mr-2 h-4 w-4" /> Generate Report
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col items-center justify-center text-center">
             <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                <BarChart2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">
                More Analytics Coming Soon
                </CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">
                Advanced dashboards for trend analysis and department performance are on the way.
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
