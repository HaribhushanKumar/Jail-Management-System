import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCharts from './DashboardCharts';
import { API_BASE_URL } from '@/config/apiConfig';

const DashboardHome = () => {
  const [stats, setStats] = useState([
    { title: 'Total Inmates', value: '...', change: 'Live', icon: '👤' },
    { title: 'Active Staff', value: '...', change: 'Live', icon: '👥' },
    { title: 'Daily Visitors', value: '...', change: 'Live', icon: '🚶' },
    { title: 'Available Cells', value: '...', change: 'Live', icon: '🏢' },
  ]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard-summary`)  
      .then(res => res.json())
      .then(data => {
        setStats([
          { title: 'Total Inmates', value: data.totalInmates.toString(), change: 'Live System Data', icon: '👤' },
          { title: 'Active Staff', value: data.activeStaff.toString(), change: 'On Duty & Active', icon: '👥' },
          { title: 'Daily Visitors', value: data.dailyVisitors.toString(), change: 'Scheduled Today', icon: '🚶' },
          { title: 'Available Cells', value: data.availableCells.toString(), change: 'Capacity Ready', icon: '🏢' },
        ]);
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
      });
  }, []);

  const recentActivities = [
    { type: 'Inmate Admission', details: 'Record verified and assigned to Cell Block A', time: '2 hours ago' },
    { type: 'Staff Shift Rotation', details: 'Day shift duty logged successfully', time: '4 hours ago' },
    { type: 'Visitor Check-in', details: 'Scheduled visitation approved', time: '6 hours ago' },
    { type: 'Cell Inspection', details: 'Cell safety inspection completed', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6 bg-white p-2">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-1">Dashboard Overview</h2>
        <p className="text-slate-500">Facility operations and real-time statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-blue-600 font-medium mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Activities</CardTitle>
            <CardDescription className="text-slate-500">Latest system activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{activity.type}</p>
                    <p className="text-xs text-slate-600">{activity.details}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Quick Actions</CardTitle>
            <CardDescription className="text-slate-500">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                <div className="text-2xl mb-2">👤</div>
                <div className="text-sm font-semibold text-blue-900">Inmate Directory</div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm font-semibold text-emerald-900">Staff Roster</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-semibold text-purple-900">Generate Report</div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-sm font-semibold text-amber-900">Cell Allocation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;