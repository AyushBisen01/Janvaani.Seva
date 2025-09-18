import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
      <CardHeader>
        <div className="mx-auto bg-muted rounded-full p-4 w-fit">
          <BarChart2 className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4 font-headline text-2xl">
          Analytics & Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is under construction. Soon you'll be able to generate detailed reports.
        </p>
      </CardContent>
    </Card>
  );
}
