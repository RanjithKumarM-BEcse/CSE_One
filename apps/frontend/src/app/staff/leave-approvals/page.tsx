"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LeaveApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const data = await fetchAPI("/leave/fa/pending");
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await fetchAPI(`/leave/fa/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      // Refresh list
      fetchPending();
    } catch (err: any) {
      alert("Action failed: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pending Leave Requests</h2>
      
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No pending leave requests assigned to you.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{req.student_id}</h3>
                  <div className="text-sm text-gray-500 font-medium my-1">
                    {req.start_date} to {req.end_date}
                  </div>
                  <p className="text-gray-700">{req.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="danger" onClick={() => handleAction(req.id, "REJECTED")}>
                    Reject
                  </Button>
                  <Button onClick={() => handleAction(req.id, "APPROVED")} className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
