"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Activity, Clock, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchAPI("/auth/me").then(setUser).catch(console.error);
  }, []);

  if (!user) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Current Attendance
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <p className="text-xs text-gray-500 mt-1">
              +2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Classes Today
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500 mt-1">
              Next: Machine Learning at 10:30 AM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Leave Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">No Active Leaves</div>
            <p className="text-xs text-gray-500 mt-1">
              All clear
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mt-8 mb-4">Today's Schedule</h3>
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Placeholder for timetable */}
        <div className="p-8 text-center text-gray-500">
          Timetable data will appear here.
        </div>
      </div>
    </div>
  );
}
