
'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Issue } from '@/lib/types';
import { differenceInDays, parseISO } from 'date-fns';

export function DepartmentPerformanceChart({ issues }: { issues: Issue[] }) {
  const data = React.useMemo(() => {
    const departments: { [key: string]: { count: number, totalDays: number, resolvedCount: number } } = {};

    issues.forEach((issue) => {
      if (!issue.assignedTo) return;

      if (!departments[issue.assignedTo]) {
        departments[issue.assignedTo] = { count: 0, totalDays: 0, resolvedCount: 0 };
      }
      departments[issue.assignedTo].count++;
      
      if (issue.status === 'Resolved' && issue.resolvedAt && issue.reportedAt) {
        const resolvedDate = typeof issue.resolvedAt === 'string' ? parseISO(issue.resolvedAt) : issue.resolvedAt;
        const reportedDate = typeof issue.reportedAt === 'string' ? parseISO(issue.reportedAt) : issue.reportedAt;
        departments[issue.assignedTo].totalDays += differenceInDays(resolvedDate, reportedDate);
        departments[issue.assignedTo].resolvedCount++;
      }
    });

    return Object.entries(departments).map(([name, data]) => ({
      name,
      issues: data.count,
      avgResolutionTime: data.resolvedCount > 0 ? parseFloat((data.totalDays / data.resolvedCount).toFixed(1)) : 0,
    }));
  }, [issues]);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} tickLine={false} angle={-30} textAnchor='end' height={60} />
          <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" fontSize={12} />
          <Tooltip 
             contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="issues" fill="hsl(var(--chart-1))" name="Total Issues" />
          <Bar yAxisId="right" dataKey="avgResolutionTime" fill="hsl(var(--chart-2))" name="Avg. Resolution Time (Days)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
