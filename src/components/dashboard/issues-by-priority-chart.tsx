
'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import type { Issue, IssuePriority } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const priorityColors: Record<IssuePriority, string> = {
  High: 'hsl(var(--destructive))',
  Medium: 'hsl(var(--accent))',
  Low: 'hsl(var(--secondary))',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function IssuesByPriorityChart({ issues }: { issues: Issue[] }) {
  const data = React.useMemo(() => {
    const counts: { [key in IssuePriority]: number } = { High: 0, Medium: 0, Low: 0 };
    issues.forEach((issue) => {
      counts[issue.priority] = (counts[issue.priority] || 0) + 1;
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
            label={renderCustomizedLabel}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={priorityColors[entry.name as IssuePriority]} />
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
