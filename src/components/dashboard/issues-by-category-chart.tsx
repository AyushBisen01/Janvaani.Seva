
'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { Issue } from '@/lib/types';


export function IssuesByCategoryChart({issues}: {issues: Issue[]}) {

  const data = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    issues.forEach((issue) => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, total]) => ({ name, total }));
  }, [issues]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
