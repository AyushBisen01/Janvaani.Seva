
'use client';

import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import type { Issue } from '@/lib/types';

export function IssuesOverTimeChart({ issues }: { issues: Issue[] }) {
  const data = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i));
    const dayStrings = last7Days.map(d => format(d, 'yyyy-MM-dd')).reverse();
    
    const counts = dayStrings.reduce((acc, dayString) => {
        acc[dayString] = 0;
        return acc;
    }, {} as {[key: string]: number});

    issues.forEach((issue) => {
      const reportedDate = typeof issue.reportedAt === 'string' ? parseISO(issue.reportedAt) : issue.reportedAt;
      const dayString = format(reportedDate, 'yyyy-MM-dd');
      if (dayString in counts) {
        counts[dayString]++;
      }
    });

    return dayStrings.map(dayString => ({
        date: format(new Date(dayString), 'MMM d'),
        count: counts[dayString]
    }));

  }, [issues]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} allowDecimals={false} />
          <Tooltip
             contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="count" name="New Issues" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
