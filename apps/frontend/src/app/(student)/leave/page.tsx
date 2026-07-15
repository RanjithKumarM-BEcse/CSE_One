"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LeavePage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const loadHistory = async () => {
    try {
      const data = await fetchAPI("/leave/student/my-requests");
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    try {
      await fetchAPI("/leave/apply", {
        method: "POST",
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          reason,
        }),
      });
      // Reset form and reload
      setStartDate("");
      setEndDate("");
      setReason("");
      loadHistory();
    } catch (err) {
      alert("Failed to apply for leave");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Start Date" 
                type="date" 
                required 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <Input 
                label="End Date" 
                type="date" 
                required 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Reason</label>
              <textarea 
                required
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
            
            <Button type="submit" isLoading={applying} className="w-full">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-gray-500 text-sm">No leave requests found.</div>
          ) : (
            <div className="space-y-4">
              {history.map((req) => (
                <div key={req.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">{req.start_date} to {req.end_date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{req.reason}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
