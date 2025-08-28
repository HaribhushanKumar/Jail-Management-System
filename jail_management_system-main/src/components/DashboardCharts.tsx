import {
  useEffect,
  useState
} from "react";
import {
  Activity,
  BarChart3,
  LineChart
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Tooltip as RechartsTooltip
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316",
  teal: "#14b8a6",
  indigo: "#6366f1"
};

const PIE_COLORS = [
  COLORS.blue,
  COLORS.green,
  COLORS.purple,
  COLORS.orange
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts = () => {
  const [cellBlockData, setCellBlockData] = useState([]);
  const [staffStatusData, setStaffStatusData] = useState([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/cell-block")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Cell Block Data:", data);
        setCellBlockData(data);
      });

    fetch("http://localhost:8080/api/staff-status")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Staff Status Data:", data);
        setStaffStatusData(data);
      });

    fetch("http://localhost:8080/api/weekly-activity")
      .then((res) => res.json())
      .then((data) => {
        const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        data.sort(
          (a, b) =>
            dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        );
        console.log("Fetched Weekly Activity Data:", data);
        setWeeklyActivityData(data);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Cell Block Occupancy Chart */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">
              Cell Block Occupancy
            </CardTitle>
            <CardDescription>
              Current inmates vs capacity by block
            </CardDescription>
          </div>
          <BarChart3 className="text-slate-400 h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cellBlockData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="current"
                  name="Current Inmates"
                  fill={COLORS.blue}
                />
                <Bar
                  dataKey="capacity"
                  name="Total Capacity"
                  fill={COLORS.green}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Staff Status Distribution Chart */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">
              Staff Status Distribution
            </CardTitle>
            <CardDescription>Current staff allocation</CardDescription>
          </div>
          <Activity className="text-slate-400 h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={staffStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {staffStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value} staff`,
                    "Count"
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity Trends Chart */}
      <Card className="bg-white border-slate-200 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">
              Weekly Activity Trends
            </CardTitle>
            <CardDescription>
              Key metrics over the past 7 days
            </CardDescription>
          </div>
          <LineChart className="text-slate-400 h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={weeklyActivityData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke={COLORS.blue}
                  name="Visitors"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  stroke={COLORS.green}
                  name="Admissions"
                />
                <Line
                  type="monotone"
                  dataKey="releases"
                  stroke={COLORS.purple}
                  name="Releases"
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke={COLORS.red}
                  name="Incidents"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
