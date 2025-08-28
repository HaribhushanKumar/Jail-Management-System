import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import html2pdf from 'html2pdf.js';

const ReportsPanel = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const reportTypes = [
    { id: 'inmate-summary', name: 'Inmate Summary Report', description: 'Overview of all inmates and their status' },
    { id: 'staff-schedule', name: 'Staff Schedule Report', description: 'Current staff assignments and schedules' },
    { id: 'visitor-log', name: 'Visitor Activity Report', description: 'Recent visitor logs and statistics' },
    { id: 'cell-occupancy', name: 'Cell Occupancy Report', description: 'Current cell assignments and availability' },
  ];

  const endpointMap: Record<string, string> = {
    'inmate-summary': 'inmates',
    'staff-schedule': 'staff',
    'visitor-log': 'visitors',
    'cell-occupancy': 'cells',
  };

  const fetchData = async () => {
    const endpoint = endpointMap[selectedReport];
    if (!endpoint) return [];

    try {
      const response = await fetch(`http://localhost:8080/api/${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch report data', error);
      return [];
    }
  };

  const generateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    const data = await fetchData();

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            h2 { font-size: 18px; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #f0f0f0; }
            .meta { margin-top: 10px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${reportTypes.find(r => r.id === selectedReport)?.name}</h1>
          <div class="meta">Generated on: ${new Date().toLocaleDateString()}</div>
          ${dateRange.start && dateRange.end
            ? `<div class="meta">From ${dateRange.start} to ${dateRange.end}</div>`
            : ''
          }

          <h2>Report Data</h2>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map((item: any) => `
                <tr>
                  ${Object.values(item).map(value => `<td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <p class="meta" style="margin-top: 40px;">Jail Management System © ${new Date().getFullYear()}</p>
        </body>
      </html>
    `;

    const element = document.createElement('div');
    element.innerHTML = html;

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `${selectedReport.replace(/-/g, '_')}_report.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .save();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Reports & Analytics</h2>
        <p className="text-slate-600">Generate comprehensive reports and analyze facility data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Report Generator</CardTitle>
              <CardDescription>Select report type and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedReport && (
                  <p className="text-sm text-slate-600">
                    {reportTypes.find(r => r.id === selectedReport)?.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={generateReport} 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!selectedReport}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Current facility overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-slate-700">Total Reports Generated</span>
                  <span className="text-xl font-bold text-blue-600">247</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-slate-700">This Month</span>
                  <span className="text-xl font-bold text-green-600">18</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-slate-700">Last Generated</span>
                  <span className="text-sm font-medium text-purple-600">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
