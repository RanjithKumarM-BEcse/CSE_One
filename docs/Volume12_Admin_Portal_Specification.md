# CSE One - Volume 12
## Admin Portal & System Administration

### 1. Admin Portal Overview
The Admin Portal is the operational control center of CSE One, explicitly tailored for the administrators of the Department of Computer Science and Engineering at S.A. Engineering College. It provides absolute oversight over the academic structure, user lifecycle, attendance enforcement, and system configuration. Designed with a desktop-first philosophy, it handles high-density data, bulk operations, and complex analytics while strictly adhering to the immutable audit principles established in previous volumes.

### 2. Dashboard Design
The Dashboard provides real-time system health and operational metrics.

**Wireframe / Layout:**
```text
+-------------------------------------------------------------+
| [Menu]   CSE One | Administration               [Notif][User] |
+-------------------------------------------------------------+
| Welcome, Administrator | Date: {Date} | Semester: {Sem}     |
+-------------------------------------------------------------+
| [ KPI Cards ]                                               |
| Students: 450 | Profs: 25 | FAs: 10 | Active Sections: 8    |
| Sessions Today: 32 | Attendance Completion: 95%             |
| Pending Leaves: 12 | Timetable Conflicts: 0 (Green)         |
+-------------------------------------------------------------+
| [ Today's Operational Summary ] | [ Recent System Activity ]|
| - Missing Attendance: P1(2)     | - Prof. X modified att.   |
| - Students Below 75%: 14        | - Admin Y swapped slot    |
+-------------------------------------------------------------+
| [ Quick Actions ]                                           |
| (Assign Substitute) (Generate Dept Report) (Sys Settings)   |
+-------------------------------------------------------------+
```

### 3. Academic Structure Management
The foundational engine for Volume 7.
- **Hierarchical Management:** Admins define Academic Years, Semesters, Sections (A-E), Subjects, and Periods.
- **Academic Calendar:** A visual calendar interface to mark `Working Days`, `Holidays`, and `Exam Days`.
- **Validation:** Deleting a Subject is blocked if it is actively linked to a Timetable or Attendance Session.

### 4. Professor Management
- **Lifecycle:** Admins create Professor accounts (which automatically provisions login credentials).
- **Assignments:** Map Professors to Subjects and Sections.
- **Roles:** Toggle the `Faculty Advisor` role on/off for any Professor.
- **Security:** Ability to force password resets or temporarily lock accounts.

### 5. Faculty Advisor Management
- **Workload Balancing:** Visual dashboard showing how many students are assigned to each FA.
- **Bulk Transfers:** Drag-and-drop interface or bulk-select tool to move 20 students from a departing FA to a new FA.
- **Historical Tracking:** Access to the `student_advisor_history` to see exactly who advised a student during a past semester.

### 6. Student Account Management
- **Oversight:** While Faculty Advisors physically create/import their cohorts (per Volume 9), Admins maintain global oversight.
- **Actions:** Admins can deactivate accounts (e.g., student drops out), reset passwords, and audit the FA assignments. Student accounts are never hard-deleted.

### 7. Timetable Management
- **Versioning Engine:** UI for creating `DRAFT` timetables, cloning from previous semesters, and hitting `PUBLISH` to make them live.
- **Conflict Detection:** Real-time validation preventing a Professor from being assigned to two sections in Period 1.
- **Substitute Workflow:** A dedicated modal where Admin selects `Date`, `Original Slot`, and `Substitute Professor`. The system automatically verifies the substitute is free before confirming.

### 8. Attendance Oversight
- **Real-Time Monitoring:** A grid showing all active periods today. Highlights any session where the Professor hasn't submitted attendance yet.
- **Administrative Overrides:** Admins can edit an attendance record (e.g., retroactively converting an Absent to an OD based on principal approval). This action forces an explicit `Admin Override` reason and logs it.
- **Session Unlocking:** Admins can unlock a 48-hour expired session to allow a Professor to fix a mistake.

### 9. Leave Oversight
- **Global View:** A master table of all `leave_request` entities across the department.
- **Filters:** By Date Range, FA, Student, or Status.
- **Intervention:** Admins can override an FA's decision (e.g., HOD mandate), which generates an override audit log.

### 10. Analytics Dashboard
- **Department Health:** Overall CSE attendance percentage plotted month-over-month.
- **Section/Subject Comparison:** Bar charts highlighting underperforming subjects or sections.
- **Modification Trends:** Graphs showing which professors modify attendance most frequently, acting as an early warning for process non-compliance.
- **Heatmaps:** Institutional level calendar heatmap.

### 11. Reporting Center
- **Template Engine:** Generates highly stylized, print-ready PDFs with the S.A. Engineering College Logo and CSE Department headers.
- **Available Reports:**
  - `Department Master Report` (All sections aggregate).
  - `Subject Attendance Register` (For university submission).
  - `Defaulters List` (Students < 75%).
  - `Audit Trail Report` (List of all manual overrides in a month).

### 12. Notification Management
- **Global Broadcasts:** Compose messages (e.g., "Tomorrow is a declared holiday") and push them to all Students and/or Staff.
- **Targeted Alerts:** Send specific reminders (e.g., "Please submit Period 1 attendance").
- **Delivery Tracking:** View read/unread ratios for critical announcements.

### 13. System Configuration
- **Global Settings:** 
  - `Attendance Warning Threshold` (Default 75%).
  - `Professor Edit Window` (Default 48 hours).
  - `Active Academic Year`.
- **Leave Categories:** Dynamically add/edit leave types (e.g., Medical, Sports, OD).

### 14. Audit Center
The immutable ledger of CSE One.
- **Data:** A massive, searchable table of the `audit_log`.
- **Filters:** By `ActionType` (e.g., `ATTENDANCE_MODIFIED`, `USER_CREATED`), `Actor`, `Date`.
- **Detail View:** Shows the exact JSON diff of `previous_state` vs `new_state`.

### 15. API Specifications
- `GET /api/v1/admin/dashboard`: Aggregates department KPIs.
- `POST /api/v1/admin/users/professors`: Create a professor.
- `PUT /api/v1/admin/timetable/versions/{id}/publish`: Activates a schedule.
- `POST /api/v1/admin/attendance/override`: Force an attendance update.
- `GET /api/v1/admin/audit-logs`: Paginated fetch of system logs.
- `POST /api/v1/admin/notifications/broadcast`: Send global alert.

### 16. Backend Service Design
- **AdminDashboardService:** Aggregates extreme volumes of data using Materialized Views to ensure sub-second dashboard loading.
- **TimetableAdministrationService:** Houses the complex conflict-detection algorithms.
- **AuditService:** A strictly append-only service that other modules pipe into via internal event buses.
- **ConfigurationService:** Caches global settings in Redis for instant read access by other services (like the AttendanceEngine).

### 17. Frontend Specifications
- **Layout:** Desktop-first. Expansive, multi-level Sidebar (Structure, Users, Academic, Reports, System).
- **Data Density:** Heavy use of DataTables (TanStack Table) with server-side pagination, sorting, and advanced column filtering.
- **Loading States:** Skeleton loaders for widgets, localized spinners for table sorts to keep the UI highly responsive.

### 18. Business Rules
- **No Hard Deletes:** Deleting an entity (Student, Subject) sets `is_active = false`. Hard deletes destroy relational integrity for historical reports.
- **Override Accountability:** Any action taken by an Admin that modifies a Professor's or FA's domain MUST capture an override reason.
- **Superuser Isolation:** Admin roles cannot mark standard daily attendance for a class unless assigned as a Substitute.

### 19. Security Strategy
- **Role-Based Perimeter:** Middleware rigidly asserts `role === 'ADMIN'` for any route under `/api/v1/admin/*`.
- **Sensitive Operations:** Actions like 'Delete Timetable Version' require the Admin to re-authenticate or type a confirmation string to prevent accidental clicks.

### 20. Performance Strategy
- **Materialized Views:** Used for the Dashboard KPIs (e.g., "Total Department Attendance %") which are refreshed asynchronously via a cron job every 15 minutes, rather than calculating millions of rows on the fly.
- **Report Queuing:** PDF generation for the entire department is offloaded to a Background Task Queue (Celery/Redis). The Admin gets a notification when the PDF is ready to download.

### 21. Testing Strategy
- **Security Tests:** Rigorous assertion that Student/Professor tokens receive `403 Forbidden` on all Admin routes.
- **Workflow Tests:** E2E testing of the Timetable Substitute workflow to ensure the override cleanly propagates to the Professor Portal.
- **Performance Tests:** Load testing the Audit Log search API to ensure it handles millions of rows using proper database indexing.

### 22. Admin Portal Architecture Decision Record (ADR)
- **ADR-ADM-001: Desktop-First Design:** Chosen because system administration (bulk assignments, massive timetable grids, complex reports) is fundamentally inefficient on mobile devices. While mobile access is supported via responsive design, the primary layout optimizes for wide screens.
- **ADR-ADM-002: Asynchronous Reporting:** Chosen to prevent HTTP timeouts. Generating a department-wide attendance report involves massive data aggregation and PDF rendering; doing this synchronously on the main thread would crash the backend under load.
- **ADR-ADM-003: Soft Deletion Policy:** Enforced absolutely at the database level to ensure that historical attendance records (e.g., from 3 years ago) still render correctly even if a Professor has since left the institution.
