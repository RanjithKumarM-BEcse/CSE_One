"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AcademicConfigPage() {
  const [activeTab, setActiveTab] = useState("departments");
  
  // Data
  const [departments, setDepartments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Forms
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  
  const [subName, setSubName] = useState("");
  const [subCode, setSubCode] = useState("");
  const [subDept, setSubDept] = useState("");

  const loadData = async () => {
    try {
      const [d, sub, sec] = await Promise.all([
        fetchAPI("/academic/departments"),
        fetchAPI("/academic/subjects"),
        fetchAPI("/academic/sections")
      ]);
      setDepartments(d);
      setSubjects(sub);
      setSections(sec);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const createDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/academic/departments", {
        method: "POST",
        body: JSON.stringify({ name: deptName, code: deptCode })
      });
      setDeptName(""); setDeptCode("");
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const createSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/academic/subjects", {
        method: "POST",
        body: JSON.stringify({ name: subName, code: subCode, department_id: subDept, credits: 3 })
      });
      setSubName(""); setSubCode("");
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {["departments", "subjects", "sections"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "departments" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Add Department</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={createDepartment} className="space-y-4">
                <Input label="Name" required value={deptName} onChange={e => setDeptName(e.target.value)} />
                <Input label="Code" required value={deptCode} onChange={e => setDeptCode(e.target.value)} />
                <Button type="submit">Create</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Existing</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {departments.map(d => (
                  <li key={d.id} className="p-3 border rounded-md flex justify-between">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-gray-500">{d.code}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Add Subject</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={createSubject} className="space-y-4">
                <Input label="Name" required value={subName} onChange={e => setSubName(e.target.value)} />
                <Input label="Code" required value={subCode} onChange={e => setSubCode(e.target.value)} />
                <div className="flex flex-col space-y-1.5 w-full">
                  <label className="text-sm font-medium">Department</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    required
                    value={subDept}
                    onChange={e => setSubDept(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <Button type="submit">Create</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Existing</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {subjects.map(s => (
                  <li key={s.id} className="p-3 border rounded-md flex justify-between">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-gray-500">{s.code}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === "sections" && (
        <div className="text-gray-500 p-8 border rounded-lg bg-gray-50 text-center">
          Section management form goes here (similar to above).
        </div>
      )}
    </div>
  );
}
