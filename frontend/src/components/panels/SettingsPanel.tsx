import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface SettingsPanelProps {
  onBack?: () => void;
}

const SettingsPanel = ({ onBack }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    facilityName: 'Central Correctional Facility',
    facilityAddress: '123 Security Blvd, Justice City, JC 12345',
    adminEmail: 'admin@jail-management.com',
    maxCapacity: '1500',
    visitorHours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    emergencyContact: '(555) 911-HELP',
    autoBackup: true,
    emailNotifications: true,
    smsAlerts: false,
    maintenanceMode: false,
    sessionTimeout: '30',
    passwordPolicy: 'Strong',
    auditLogging: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "All settings have been updated successfully",
    });
  };

  const handleReset = () => {
    setSettings({
      facilityName: 'Central Correctional Facility',
      facilityAddress: '123 Security Blvd, Justice City, JC 12345',
      adminEmail: 'admin@jail-management.com',
      maxCapacity: '1500',
      visitorHours: 'Monday-Friday: 9:00 AM - 5:00 PM',
      emergencyContact: '(555) 911-HELP',
      autoBackup: true,
      emailNotifications: true,
      smsAlerts: false,
      maintenanceMode: false,
      sessionTimeout: '30',
      passwordPolicy: 'Strong',
      auditLogging: true,
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    });
  };

  return (
    <div className="space-y-6 bg-white p-2">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">System Settings</h2>
          <p className="text-slate-500">Configure system preferences and facility information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Facility Information</CardTitle>
            <CardDescription className="text-slate-500">Basic facility details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facilityName">Facility Name</Label>
              <Input
                id="facilityName"
                value={settings.facilityName}
                onChange={(e) => setSettings({ ...settings, facilityName: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facilityAddress">Facility Address</Label>
              <Input
                id="facilityAddress"
                value={settings.facilityAddress}
                onChange={(e) => setSettings({ ...settings, facilityAddress: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Administrator Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Maximum Capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={settings.maxCapacity}
                onChange={(e) => setSettings({ ...settings, maxCapacity: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={settings.emergencyContact}
                onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">System Preferences</CardTitle>
            <CardDescription className="text-slate-500">Automated features and notification options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Database Backups</Label>
                <p className="text-sm text-slate-500">Daily automated snapshots of database records</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive alerts for important system events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-sm text-slate-500">Log all administrative actions and updates</p>
              </div>
              <Switch
                checked={settings.auditLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 border-t border-slate-100 pt-4">
        <Button variant="outline" onClick={handleReset} className="border-slate-200 text-slate-700">
          Reset Defaults
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
