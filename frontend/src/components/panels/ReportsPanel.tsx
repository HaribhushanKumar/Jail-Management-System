import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import html2pdf from 'html2pdf.js';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

interface ReportsPanelProps {
  onBack?: () => void;
}

const ReportsPanel = ({ onBack }: ReportsPanelProps) => {
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
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
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
            body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
            h1 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            p { font-size: 14px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
            th { background-color: #f1f5f9; color: #0f172a; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>${reportTypes.find(r => r.id === selectedReport)?.name}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()} | Date Range: ${dateRange.start || 'N/A'} to ${dateRange.end || 'N/A'}</p>
          <table>
            <thead>
              <tr>
                ${data.length > 0 ? Object.keys(data[0]).map(key => `<th>${key}</th>`).join('') : '<th>No Data</th>'}
              </tr>
            </thead>
            <tbody>
              ${data.map((row: any) => `
                <tr>
                  ${Object.values(row).map(val => `<td>${typeof val === 'object' ? JSON.stringify(val) : val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const element = document.createElement('div');
    element.innerHTML = html;

    const opt = {
      margin: 0.5,
      filename: `${selectedReport}-report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
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
          <h2 className="text-3xl font-bold text-slate-900">Reports & Analytics</h2>
          <p className="text-slate-500">Generate and export facility reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-blue-600" /> Report Configuration
            </CardTitle>
            <CardDescription className="text-slate-500">
              Select report type and date range to export PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="bg-white border-slate-200"
                />
              </div>
            </div>

            <Button onClick={generateReport} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
              <Download className="h-4 w-4" /> Export PDF Report
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Report Templates</CardTitle>
            <CardDescription className="text-slate-500">Available facility report definitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportTypes.map((report) => (
              <div key={report.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <h4 className="font-semibold text-slate-800">{report.name}</h4>
                <p className="text-sm text-slate-500">{report.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPanel;
