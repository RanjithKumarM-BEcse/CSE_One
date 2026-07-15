"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function StaffDashboard() {
  const router = useRouter();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI("/timetable/professor/today")
      .then(setTimetable)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStartAttendance = async (period: any) => {
    try {
      // Create session, which auto-hydrates students
      const session = await fetchAPI("/attendance/sessions", {
        method: "POST",
        body: JSON.stringify({
          timetable_period_id: period.id,
          // Use today's date in YYYY-MM-DD
          date: new Date().toISOString().split('T')[0] 
        })
      });
      router.push(`/staff/attendance/${session.id}`);
    } catch (err: any) {
      // If it already exists, backend throws 400. We should ideally fetch existing session ID.
      // For this prototype, we alert if it fails.
      alert(err.message || "Failed to start session.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
      
      {loading ? (
        <div>Loading timetable...</div>
      ) : timetable.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            You have no classes scheduled for today.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timetable.map((period) => (
            <Card key={period.id}>
              <CardHeader>
                <CardTitle>Period {period.period_number}</CardTitle>
                <div className="text-sm text-gray-500">Day {period.day_of_week}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">Section: {period.section_id}</div>
                  <div className="text-sm text-gray-600">Subject: {period.subject_id}</div>
                </div>
                <Button onClick={() => handleStartAttendance(period)} className="w-full">
                  Mark Attendance
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
