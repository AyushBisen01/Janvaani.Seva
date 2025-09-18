import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6',
        className
      )}
    >
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex w-full items-center gap-4">
        <h1 className="flex-1 text-2xl font-headline font-semibold">
          {title}
        </h1>
        {children}
      </div>
    </header>
  );
}
