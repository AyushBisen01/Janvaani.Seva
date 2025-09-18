
'use client';

import * as React from 'react';
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ResolutionFunnelChart({ issues }: { issues: Issue[] }) {
  const data = React.useMemo(() => {
    const reported = issues.length;
    const approved = issues.filter(
      (i) => i.status !== 'Pending' && i.status !== 'Rejected'
    ).length;
    const assigned = issues.filter(
      (i) => i.status === 'Assigned' || i.status === 'Resolved'
    ).length;
    const resolved = issues.filter((i) => i.status === 'Resolved').length;

    return [
      {
        value: reported,
        name: 'Reported',
        fill: 'hsl(var(--chart-1))',
      },
      {
        value: approved,
        name: 'Approved',
        fill: 'hsl(var(--chart-2))',
      },
      {
        value: assigned,
        name: 'Assigned',
        fill: 'hsl(var(--chart-3))',
      },
      {
        value: resolved,
        name: 'Resolved',
        fill: 'hsl(var(--chart-4))',
      },
    ];
  }, [issues]);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip 
             contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
          />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList
              position="right"
              fill="#000"
              stroke="none"
              dataKey="name"
              className="font-semibold text-foreground"
            />
             <LabelList
              position="center"
              fill="#fff"
              stroke="none"
              dataKey="value"
               formatter={(value: number) => {
                const total = issues.length;
                if (total === 0) return '0%';
                const percentage = (value / total) * 100;
                return `${percentage.toFixed(0)}%`;
              }}
              className="font-bold"
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
