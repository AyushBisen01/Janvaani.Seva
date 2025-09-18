
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Issue, IssueStatus } from '@/lib/types';

const statusColors: Record<IssueStatus, string> = {
  Pending: 'hsl(var(--chart-5))',
  Approved: 'hsl(var(--chart-4))',
  Assigned: 'hsl(var(--chart-3))',
  Resolved: 'hsl(var(--chart-1))',
  Rejected: 'hsl(var(--destructive))',
};

export function IssuesByStatusChart({ issues }: { issues: Issue[] }) {
  const data = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    issues.forEach((issue) => {
      counts[issue.status] = (counts[issue.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={statusColors[entry.name as IssueStatus]} />
            ))}
          </Pie>
          <Tooltip
             contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
          />
          <Legend iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
