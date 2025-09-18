
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
import { FileDown, BarChart2, FileSpreadsheet, FileText } from 'lucide-react';

export default function ReportsPage() {
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
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="pwd">Public Works</SelectItem>
                    <SelectItem value="water">Water Dept.</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
           </div>
        </CardContent>
        <CardFooter className='gap-2'>
          <Button>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export as CSV
          </Button>
           <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
        </CardFooter>
      </Card>
      
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center text-center p-6">
             <div className="mx-auto bg-muted rounded-full p-4 w-fit mb-4">
                <BarChart2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="font-headline text-xl">
              Advanced Analytics
            </CardTitle>
             <CardContent className="p-0 mt-2">
                <p className="text-muted-foreground text-sm">
                  Trend analysis and department performance dashboards are coming soon.
                </p>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
