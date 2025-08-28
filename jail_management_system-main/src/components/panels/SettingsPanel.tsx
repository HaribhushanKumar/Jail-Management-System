
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const SettingsPanel = () => {
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
    // Simulate saving settings
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">System Settings</h2>
        <p className="text-slate-600">Configure system preferences and facility information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Facility Information</CardTitle>
            <CardDescription>Basic facility details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facilityName">Facility Name</Label>
              <Input
                id="facilityName"
                value={settings.facilityName}
                onChange={(e) => setSettings({ ...settings, facilityName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facilityAddress">Facility Address</Label>
              <Input
                id="facilityAddress"
                value={settings.facilityAddress}
                onChange={(e) => setSettings({ ...settings, facilityAddress: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Administrator Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Maximum Capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={settings.maxCapacity}
                onChange={(e) => setSettings({ ...settings, maxCapacity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={settings.emergencyContact}
                onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Operational Settings</CardTitle>
            <CardDescription>Visitor hours and operational parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visitorHours">Visitor Hours</Label>
              <Input
                id="visitorHours"
                value={settings.visitorHours}
                onChange={(e) => setSettings({ ...settings, visitorHours: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select value={settings.passwordPolicy} onValueChange={(value) => setSettings({ ...settings, passwordPolicy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic (8 characters)</SelectItem>
                  <SelectItem value="Strong">Strong (12 characters, mixed case)</SelectItem>
                  <SelectItem value="Maximum">Maximum (16 characters, special chars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Notifications & Alerts</CardTitle>
            <CardDescription>Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600">Receive important updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>SMS Alerts</Label>
                <p className="text-sm text-slate-600">Receive critical alerts via SMS</p>
              </div>
              <Switch
                checked={settings.smsAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, smsAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Backup</Label>
                <p className="text-sm text-slate-600">Automatically backup system data</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Audit Logging</Label>
                <p className="text-sm text-slate-600">Log all system activities</p>
              </div>
              <Switch
                checked={settings.auditLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>System maintenance and advanced options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-slate-600">Enable for system maintenance</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-slate-800">Database Operations</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Backup Data
                </Button>
                <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                  Export Reports
                </Button>
                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                  Clear Logs
                </Button>
                <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                  System Check
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-slate-800">User Management</h4>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                  Manage User Accounts
                </Button>
                <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                  View Access Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          Save Settings
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
