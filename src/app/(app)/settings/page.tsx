
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system-wide configurations and preferences.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how and when notifications are sent to citizens and staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
                <h3 className="font-medium">Citizen Notifications</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor='citizen-email'>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send an email when an issue status changes.
                    </p>
                  </div>
                  <Switch id='citizen-email' defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor='citizen-sms'>SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send an SMS when an issue is resolved.
                    </p>
                  </div>
                  <Switch id='citizen-sms' />
                </div>
             </div>
             <Separator />
             <div className="space-y-4">
                <h3 className="font-medium">Internal Notifications</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor='internal-push'>Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify staff when an issue is assigned to their department.
                    </p>
                  </div>
                  <Switch id='internal-push' defaultChecked />
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Departments & Categories</CardTitle>
            <CardDescription>
              Manage issue categories and the departments they are routed to.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Categories</Label>
                 <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                        <Input defaultValue="Pothole" />
                        <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                    </div>
                     <div className="flex items-center gap-2">
                        <Input defaultValue="Garbage" />
                        <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                    </div>
                     <div className="flex items-center gap-2">
                        <Input defaultValue="Water Leakage" />
                        <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                    </div>
                 </div>
                 <Button variant="outline" size="sm" className="mt-2">Add Category</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Triage Settings</CardTitle>
            <CardDescription>
              Adjust the behavior of the automated AI issue triaging.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="priority-keywords">Critical Priority Keywords</Label>
                <Textarea id="priority-keywords" placeholder="e.g., fire, gas leak, power line down" defaultValue="sinkhole, open manhole, blocked road, large water leak" />
                <p className="text-xs text-muted-foreground">
                    Keywords that will automatically escalate an issue to high priority. Separate keywords with commas.
                </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence-threshold">
                AI Confidence Threshold for Auto-Approval
              </Label>
              <Select defaultValue="85">
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="95">95% (High Confidence)</SelectItem>
                  <SelectItem value="85">85% (Recommended)</SelectItem>
                  <SelectItem value="75">75% (Lower Confidence)</SelectItem>
                   <SelectItem value="100">100% (Manual Approval Only)</SelectItem>
                </SelectContent>
              </Select>
               <p className="text-xs text-muted-foreground">
                  Issues with AI confidence below this level will require manual approval.
                </p>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="flex justify-end">
          <Button>Save All Settings</Button>
        </div>
    </div>
  );
}
