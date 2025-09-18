
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

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system-wide configurations and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic application settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue="CivicMonitor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-logo">Application Logo</Label>
              <Input id="app-logo" type="file" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Temporarily take the public reporting portal offline.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how and when notifications are sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send emails for new issues and status changes.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
             <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email Address</Label>
              <Input id="admin-email" type="email" defaultValue="admin@civic.gov" />
               <p className="text-xs text-muted-foreground">Critical alerts will be sent to this address.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
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
                AI Confidence Threshold
              </Label>
              <Select defaultValue="85">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="95">95% (High Confidence)</SelectItem>
                  <SelectItem value="85">85% (Recommended)</SelectItem>
                  <SelectItem value="75">75% (Lower Confidence)</SelectItem>
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
          <Button>Save Changes</Button>
        </div>
    </div>
  );
}
