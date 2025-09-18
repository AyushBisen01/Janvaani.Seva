
'use client';

import * as React from 'react';
import { format } from 'date-fns';

interface FormattedDateProps {
  date?: Date;
  formatStr?: string;
}

export function FormattedDate({ date, formatStr = 'PPP' }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = React.useState('');

  React.useEffect(() => {
    if (date) {
      setFormattedDate(format(date, formatStr));
    }
  }, [date, formatStr]);

  return <>{formattedDate}</>;
}
