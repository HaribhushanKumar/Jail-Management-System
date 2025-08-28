import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCharts from './DashboardCharts';

const DashboardHome = () => {
  const [stats, setStats] = useState([
    { title: 'Total Inmates', value: '...', change: '...', icon: '👤' },
    { title: 'Active Staff', value: '...', change: '...', icon: '👥' },
    { title: 'Daily Visitors', value: '...', change: '...', icon: '🚶' },
    { title: 'Available Cells', value: '...', change: '...', icon: '🏢' },
  ]);

  // Example: fetch stats from backend on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/dashboard-summary')  
      .then(res => res.json())
      .then(data => {
        // Assuming your backend sends an object like:
        // { totalInmates: 1247, activeStaff: 89, dailyVisitors: 156, availableCells: 23 }
        setStats([
          { title: 'Total Inmates', value: data.totalInmates.toString(), change: '+12', icon: '👤' },
          { title: 'Active Staff', value: data.activeStaff.toString(), change: '+3', icon: '👥' },
          { title: 'Daily Visitors', value: data.dailyVisitors.toString(), change: '-8', icon: '🚶' },
          { title: 'Available Cells', value: data.availableCells.toString(), change: '+5', icon: '🏢' },
        ]);
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        // fallback or error state handling here
      });
  }, []);

  const recentActivities = [
    { type: 'Inmate Check-in', details: 'John Doe admitted to Cell Block A', time: '2 hours ago' },
    { type: 'Staff Shift Change', details: 'Night shift rotation completed', time: '4 hours ago' },
    { type: 'Visitor Logged', details: 'Family visit scheduled for tomorrow', time: '6 hours ago' },
    { type: 'Cell Maintenance', details: 'Cell 204 maintenance completed', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
        <p className="text-slate-600">Monitor your facility operations at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add the charts component */}
      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <>
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Recent Activities</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{activity.type}</p>
                      <p className="text-sm text-slate-600">{activity.details}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">➕</div>
                  <div className="text-sm font-medium text-slate-700">Add Inmate</div>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">👷</div>
                  <div className="text-sm font-medium text-slate-700">Add Staff</div>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-sm font-medium text-slate-700">Generate Report</div>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="text-sm font-medium text-slate-700">System Settings</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      </div>
    </div>
  );
};

export default DashboardHome;