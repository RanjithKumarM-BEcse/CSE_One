# CSE One - Volume 11
## Academic Staff Portal (Professor & Faculty Advisor)

### 1. Academic Staff Portal Overview
The Academic Staff Portal is the unified operational hub for all teaching faculty at S.A. Engineering College's Department of Computer Science and Engineering. Adhering to the principle of "One Portal, Dynamic Permissions," it eliminates separate logins for Faculty Advisors. When a standard Professor logs in, they see their teaching timetable and attendance modules. If that Professor is also designated as a Faculty Advisor, the portal seamlessly hydrates with additional widgets for cohort management and leave approvals.

### 2. Dashboard Design
The dashboard acts as a context-aware command center.

**Wireframe / Layout:**
```text
+-------------------------------------------------------------+
| [Menu]   CSE One | Academic Staff Portal        [Notif][User] |
+-------------------------------------------------------------+
| [ Welcome Card ]                                            |
| Prof. {Name} | ID: {EmpID} | Designation: {Designation}     |
| Dept: Computer Science and Engineering                      |
| Date: {Current_Date} | Time: {Current_Time} | Period: {P}   |
+-------------------------------------------------------------+
| [ Core Metrics Row ]                                        |
| Today's Classes: 4        | Completed: 2                    |
| Pending Attendance: 1     | Leaves Pending (FA only): 3     |
+-------------------------------------------------------------+
| [ Intelligent Timetable Widget ]                            |
| CURRENT CLASS: CS-301 | Section A | III Year                |
| [ START ATTENDANCE ] (Pulsing Primary Button)               |
+-------------------------------------------------------------+
| [ Cohort Overview (Visible to FA only) ]                    |
| Students Assigned: 22     | Below 75% Alert: 2 Students     |
+-------------------------------------------------------------+
```

### 3. Timetable Integration
- **Zero-Touch Configuration:** The portal executes the workflow defined in Volume 7. It polls the server's time against the `academic_calendar` and `period` tables.
- **Dynamic Display:** The "Current Class" widget automatically populates with the Year, Section, and Subject. The Professor cannot alter this.
- **Substitute Awareness:** If an Admin assigns the Professor as a substitute for another class, that class automatically overrides their dashboard for that specific period.

### 4. Attendance Module
- **Initialization:** Clicking "Start Attendance" opens the `attendance_session` screen.
- **Roster:** A highly optimized list displaying Register Number, Name, and an embedded Photo placeholder.
- **Integration Indicators:** If a student has an `APPROVED` leave request from their Faculty Advisor (Volume 9), a green "OD" or "Leave" chip appears next to their name.
- **Submission:** The Professor marks P/A/OD. If 'A' is clicked, the system prompts for a reason, pre-filling it if the student's leave was approved.

### 5. Attendance Modification Workflow
1. **Initiation:** The Professor accesses the "Attendance History" tab and selects a previously `SUBMITTED` session (within the 48-hour window).
2. **Reopening:** The Professor clicks "Edit Attendance".
3. **Mutation:** The Professor changes a student's status (e.g., A -> P).
4. **Mandatory Audit Reason:** A modal demands a textual reason for the change (e.g., "Student arrived 15 minutes late, marked present").
5. **Finalization:** The backend executes the update and writes the immutable `audit_log`.

### 6. Faculty Advisor Features
These features are dynamically injected if the backend detects the `is_faculty_advisor = true` flag on the Professor's identity.
- **Cohort Widget:** Summary of assigned students.
- **At-Risk Alerts:** A red banner highlighting students in the FA's cohort whose cumulative attendance has dropped below 75%.
- **Leave Inbox:** Direct access to pending `leave_request` items originating from their assigned students.

### 7. Leave Approval
- **Contextual Review:** Clicking a pending leave opens a split pane. Left: The request (Dates, Reason, Medical Document). Right: The student's current attendance percentage and history to inform the FA's decision.
- **Actions:** [ Approve ] or [ Reject ].
- **Remarks:** Mandatory if rejecting; optional if approving.
- **Notification Trigger:** Approving/Rejecting dispatches a WebSocket or Push notification back to the Student Portal (Volume 10).

### 8. Student Management
- **Search:** FA can quickly search their assigned 20 students by name or register number.
- **Deep Dive:** FA can click a student to view their exact academic profile, complete attendance timeline across all subjects, and full leave history.

### 9. Analytics
- **Personal Workload:** Bar charts showing hours taught per week vs. assigned workload.
- **Section Completion:** Progress bars showing syllabus/attendance completion rate for assigned subjects.
- **FA Analytics:** (For FAs only) Cohort average attendance, leave trends (e.g., "Medical leaves spike in November").

### 10. Reports
- **Official Exports:** On-demand PDF generation featuring the S.A. Engineering College Logo and digital timestamp.
- **Professor Reports:** "Subject-wise Attendance Register" (Excel/PDF) required for end-of-semester university submission.
- **FA Reports:** "Cohort Attendance Summary" detailing the status of all assigned students for HOD review.

### 11. Notifications
- **System Inbox:** Bell icon in the header.
- **Triggers:**
  - "Admin has assigned you as a Substitute for Period 3."
  - "New Leave Request from {Student}." (FA only)
  - "Reminder: You have an unmarked attendance session from Period 1."
- **State:** Unread count bubble, click-to-mark-read functionality.

### 12. API Specifications
- `GET /api/v1/staff/dashboard`: Aggregates timetable, pending tasks, and FA metrics if applicable.
- `GET /api/v1/staff/timetable/today`: Retrieves exact slots for the current day.
- `POST /api/v1/staff/attendance/sessions`: Initializes an attendance session based on the current timetable slot.
- `PUT /api/v1/staff/attendance/records/{id}/modify`: Alters an existing record, expecting an `audit_reason`.
- `GET /api/v1/staff/fa/leaves`: Retrieves pending leaves (403 Forbidden if not an FA).
- `PUT /api/v1/staff/fa/leaves/{id}/approve`: Approves a leave request.

### 13. Backend Service Design
- **StaffDashboardService:** Acts as an API Gateway pattern. Orchestrates calls to `TimetableService`, `AttendanceService`, and conditionally `LeaveService` based on user roles.
- **AttendanceModificationService:** Dedicated service that wraps the update logic in a database transaction alongside the `audit_log` insert to guarantee atomicity.
- **ReportService:** Asynchronous service for generating heavy PDFs (e.g., using Celery or FastAPI BackgroundTasks) to prevent blocking the main thread.

### 14. UI/UX Specifications
- **Responsive Layouts:**
  - *Mobile:* Bottom App Bar (Home, Timetable, Classes, Settings). Essential for professors marking attendance while walking around the lab.
  - *Desktop/Tablet:* Expansive left Sidebar (Dashboard, My Timetable, Attendance History, FA Panel, Reports).
- **Component Hierarchy:** Utilizes shadcn/ui. Heavy use of Data Tables for rosters and Dialogs for modification reasons.
- **State Diagrams:** Seamless loading skeletons for the Dashboard to prevent layout shift during API fetching.

### 15. Business Rules
- **Role Isolation:** A Professor can only modify attendance for sessions they conducted. They cannot access sessions conducted by others unless explicitly granted an Admin override.
- **FA Boundaries:** A Faculty Advisor can only approve leaves for their explicitly assigned cohort.
- **Timetable Immutability:** Professors cannot alter the timetable. If a class is swapped, an Admin must execute the swap in the backend.

### 16. Performance Strategy
- **Optimized Student Lists:** The `/sessions` endpoint returns a heavily pruned JSON payload (ID, Name, RegNo, LeaveStatus) to ensure instant rendering on low-end mobile devices.
- **Batch Updates:** Modifying a large session submits a single JSON array to the backend, utilizing PostgreSQL `executemany` rather than N+1 queries.
- **Caching:** The dashboard's "Today's Timetable" is cached client-side (Zustand/React Query) since it rarely changes mid-day.

### 17. Audit Logging
- **Tracked Events:** `STAFF_LOGIN`, `ATTENDANCE_CREATED`, `ATTENDANCE_MODIFIED`, `LEAVE_APPROVED`, `LEAVE_REJECTED`, `REPORT_GENERATED`.
- **Integrity:** Every `ATTENDANCE_MODIFIED` log rigidly captures the `previous_status`, `new_status`, `professor_id`, and `reason`.

### 18. Testing Strategy
- **Unit Tests:** Verify the UI correctly hides FA widgets when a standard Professor logs in.
- **Integration Tests:** Test the atomic transaction of modifying attendance and ensuring the audit log is created simultaneously.
- **Permission Tests:** Attempt to hit the `PUT /api/v1/staff/fa/leaves/{id}/approve` endpoint with a standard Professor JWT to verify a `403 Forbidden` response.

### 19. Academic Staff Portal Architecture Decision Record (ADR)
- **ADR-ASP-001: Unified Portal over Separate FA Portal:** Chosen to reduce cognitive load on staff and eliminate the need to maintain two separate frontend codebases. Feature flags based on JWT roles dynamically build the UI.
- **ADR-ASP-002: Mandatory Audit Reason on Modification:** Chosen to enforce accountability. While making a mistake during rapid attendance marking is common, changing it later requires a documented justification to prevent academic fraud.
- **ADR-ASP-003: Push/WebSocket Notifications for Leaves:** Chosen so FAs don't have to manually refresh the page to see incoming leave requests, improving SLA response times for students waiting for approval.
