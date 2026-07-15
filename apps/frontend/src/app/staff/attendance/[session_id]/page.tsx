"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AttendanceSessionPage() {
  const { session_id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<Record<string, string>>({}); // student_id -> status

  useEffect(() => {
    fetchAPI(`/attendance/sessions/${session_id}`)
      .then((data) => {
        setSession(data);
        // Initialize updates with current data
        const initialUpdates: Record<string, string> = {};
        data.records.forEach((r: any) => {
          initialUpdates[r.student_id] = r.status;
        });
        setUpdates(initialUpdates);
      })
      .catch((err) => {
        alert(err.message);
        router.push('/staff/dashboard');
      })
      .finally(() => setLoading(false));
  }, [session_id, router]);

  const handleStatusChange = (student_id: string, status: string) => {
    setUpdates(prev => ({ ...prev, [student_id]: status }));
  };

  const handleSave = async () => {
    try {
      const recordsToUpdate = Object.entries(updates).map(([student_id, status]) => ({
        student_id,
        status,
        remarks: ""
      }));

      await fetchAPI(`/attendance/sessions/${session_id}/mark`, {
        method: "PUT",
        body: JSON.stringify({ records: recordsToUpdate })
      });
      alert("Attendance saved.");
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleCommit = async () => {
    if (!confirm("Are you sure? Committing will lock this session.")) return;
    
    try {
      await handleSave(); // save any pending changes first
      await fetchAPI(`/attendance/sessions/${session_id}/commit`, {
        method: "POST"
      });
      alert("Session committed.");
      router.push('/staff/dashboard');
    } catch (err: any) {
      alert("Failed to commit: " + err.message);
    }
  };

  if (loading) return <div>Loading session...</div>;
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
          <p className="text-gray-500">Date: {session.date} | Status: {session.status}</p>
        </div>
        
        {session.status === "DRAFT" && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleSave}>Save Draft</Button>
            <Button onClick={handleCommit}>Commit Session</Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">Student ID</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {session.records.map((record: any) => (
                <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{record.student_id}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant={updates[record.student_id] === 'PRESENT' ? 'primary' : 'secondary'}
                        onClick={() => handleStatusChange(record.student_id, 'PRESENT')}
                        disabled={session.status !== 'DRAFT'}
                      >
                        Present
                      </Button>
                      <Button 
                        type="button"
                        variant={updates[record.student_id] === 'ABSENT' ? 'danger' : 'secondary'}
                        onClick={() => handleStatusChange(record.student_id, 'ABSENT')}
                        disabled={session.status !== 'DRAFT'}
                      >
                        Absent
                      </Button>
                      <Button 
                        type="button"
                        variant={updates[record.student_id] === 'ON_LEAVE' ? 'primary' : 'secondary'}
                        onClick={() => handleStatusChange(record.student_id, 'ON_LEAVE')}
                        disabled={session.status !== 'DRAFT'}
                        className={updates[record.student_id] === 'ON_LEAVE' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                      >
                        Leave
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
