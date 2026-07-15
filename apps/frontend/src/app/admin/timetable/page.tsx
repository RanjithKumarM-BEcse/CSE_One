"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TimetableConfigPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  // In a real app we'd fetch professors, hardcoding a user ID input for simplicity in this MVP
  const [profId, setProfId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [period, setPeriod] = useState("1");

  useEffect(() => {
    Promise.all([
      fetchAPI("/academic/sections"),
      fetchAPI("/academic/subjects")
    ]).then(([sec, sub]) => {
      setSections(sec);
      setSubjects(sub);
    });
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/timetable/", {
        method: "POST",
        body: JSON.stringify({
          section_id: sectionId,
          subject_id: subjectId,
          professor_id: profId,
          day_of_week: parseInt(dayOfWeek),
          period_number: parseInt(period)
        })
      });
      alert("Timetable period created.");
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Map Timetable Period</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssign} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Section</label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" required value={sectionId} onChange={e=>setSectionId(e.target.value)}>
                <option value="">Select...</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name} (Yr {s.year})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Subject</label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" required value={subjectId} onChange={e=>setSubjectId(e.target.value)}>
                <option value="">Select...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Day of Week (1-7)</label>
              <input type="number" min="1" max="7" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" required value={dayOfWeek} onChange={e=>setDayOfWeek(e.target.value)} />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Period Number (1-8)</label>
              <input type="number" min="1" max="8" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" required value={period} onChange={e=>setPeriod(e.target.value)} />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Professor User ID (UUID)</label>
            <input type="text" placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" required value={profId} onChange={e=>setProfId(e.target.value)} />
          </div>

          <Button type="submit" className="w-full">Assign Period</Button>
        </form>
      </CardContent>
    </Card>
  );
}
