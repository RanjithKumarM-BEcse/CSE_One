"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Server, Users, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-t-red-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              System Status
            </CardTitle>
            <Server className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-gray-500 mt-1">All services operational</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-gray-500 mt-1">Students & Faculty</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Actions
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">Requires admin attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/academic" className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
            Configure Departments
          </a>
          <a href="/admin/timetable" className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
            Manage Timetables
          </a>
        </div>
      </div>
    </div>
  );
}
