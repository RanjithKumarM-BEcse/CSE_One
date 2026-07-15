# CSE One - Volume 10
## Student Portal & Student Experience Platform

### 1. Student Portal Overview
The Student Portal is the primary digital interface for learners within the Department of Computer Science and Engineering at S.A. Engineering College. Far beyond a simple attendance viewer, it is a comprehensive, personalized academic dashboard. Designed as a Progressive Web Application (PWA) with a mobile-first philosophy, it aggregates data from the Timetable, Attendance, and Leave engines into a single, cohesive, and empowering experience. 

### 2. Dashboard Design
The dashboard provides an at-a-glance summary of the student's academic standing and immediate schedule.

**Wireframe / Layout:**
```text
+-------------------------------------------------------------+
| Header: [Menu]   CSE One | Student Portal       [Notif][User] |
+-------------------------------------------------------------+
| [ Welcome Card ]                                            |
| Hello, {Name} | Reg No: {RegNo} | Section: {Section}        |
| Faculty Advisor: {FA_Name} | Date: {Current_Date}           |
+-------------------------------------------------------------+
| [ Core Metrics Row ]                                        |
| Overall % : 82% (Green)   | Present : 150                   |
| Absent    : 12  (Red)     | OD / Leaves: 5 (Amber)          |
+-------------------------------------------------------------+
| [ Current & Next Class ]                                    |
| NOW: CS-301 (Prof. Smith) | NEXT: CS-305 (Prof. Doe)        |
+-------------------------------------------------------------+
| [ Quick Actions ]                                           |
| (Apply Leave)  (View Reports)  (Full Timetable)             |
+-------------------------------------------------------------+
| [ Recent Notifications ]                                    |
| - Your leave for 15/07 was Approved by {FA_Name}            |
+-------------------------------------------------------------+
```

### 3. Student Profile
A centralized view of the student's identity and academic context.
- **Personal Details:** Name, Profile Photo, DOB, Blood Group, Phone Number.
- **Academic Details:** Register Number, College Email, Year (I/II/III/IV), Section (A/B/C/D/E).
- **Institutional Details:** S.A. Engineering College, Department of Computer Science and Engineering, Current Semester.
- **Advisory Details:** Assigned Faculty Advisor Name and Contact.

### 4. Attendance Module
The Attendance Module provides full transparency into the student's physical presence records.
- **Views:** List View, Calendar View, Timeline View.
- **Subject-wise Breakdown:** A table showing `Subject Name`, `Conducted`, `Attended`, `Percentage`.
- **Absence Details Expansion:** For every `Absent` record, the UI displays the Date, Period, Subject, Professor, and whether it was `Prior Informed` alongside FA Remarks.
- **Filters:** By Month, by Subject, or by Status (e.g., "Show all ODs").

### 5. Attendance Analytics
Empowering students with data to self-manage their academic standing.
- **Trend Graphs:** Line chart showing weekly attendance percentage trends.
- **Heatmap:** GitHub-style contribution graph mapping 365 days. (Green = 100% present, Red = 100% absent, Yellow = Mixed/OD).
- **Risk Indicator:** If the overall percentage drops below 75%, a prominent warning banner appears on the dashboard detailing the exact number of classes needed to recover the percentage.

### 6. Leave Module
A seamless interface for managing absences, deeply tied to Volume 9.
- **Apply Leave Form:** Select Date Range, Type (Medical, Personal, OD), and Reason.
- **History Tab:** List of past requests with colored Status Chips (`Pending`, `Approved`, `Rejected`, `Cancelled`).
- **Interactive Details:** Clicking a request reveals the Faculty Advisor's decision remarks and approval timestamp.

### 7. Timetable Module
A read-only manifestation of the Intelligent Timetable Engine (Volume 7).
- **Today's Schedule:** A vertical timeline highlighting the *Current Period* with a pulsing animation.
- **Weekly Grid:** A traditional Mon-Fri grid view for planning.
- **Details:** Each slot shows Period Number, Time, Subject Name, and Professor Name.

### 8. Notifications
- **Real-time Updates:** Badges on the header bell icon for unread alerts.
- **Categories:** Leave status changes (Approved/Rejected), Attendance warnings (Below 75%), System announcements.
- **State Management:** Notifications can be marked as read, or dismissed entirely.

### 9. Reports
On-demand PDF generation for official record-keeping.
- **Format:** High-quality PDF rendering featuring the S.A. Engineering College Logo, Department Header, and digital timestamp.
- **Contents:** Comprehensive summary of Subject-wise attendance, total working days, present days, and leave history.
- **Export:** Accessible via a sticky "Download Report" button on the Attendance Module.

### 10. API Specifications
Read-heavy RESTful endpoints secured by the student's JWT.
- `GET /api/v1/student/dashboard`: Aggregated endpoint returning profile, core metrics, and next class.
- `GET /api/v1/student/attendance/overall`: Cumulative stats.
- `GET /api/v1/student/attendance/subject-wise`: Breakdown per subject.
- `GET /api/v1/student/attendance/timeline`: Chronological list of attendance records.
- `GET /api/v1/student/timetable/today`: Today's classes.
- `GET /api/v1/student/notifications`: Inbox.
- `POST /api/v1/student/reports/generate`: Triggers PDF generation.

### 11. Backend Integration
- **API Gateway / Aggregation:** The `StudentDashboardService` aggregates data from `AttendanceService`, `TimetableService`, and `LeaveService` to minimize frontend network requests.
- **Authorization Context:** All queries implicitly filter by `student_id = {current_user}`. Students can NEVER query another student's ID.

### 12. UI/UX Specifications
- **Navigation:** Bottom Navigation Bar for Mobile (Dashboard, Timetable, Attendance, Leave, Profile). Left Sidebar for Desktop.
- **Empty States:** "No classes today! Enjoy your holiday." with custom illustrations.
- **Loading States:** Skeleton loaders matching the exact dimensions of the actual components to prevent Layout Shift.
- **Offline Mode (PWA):** Service Worker caches the dashboard and today's timetable. If offline, a gray banner reads "You are viewing offline data."

### 13. Business Rules
- **Strict Isolation:** A student can only view their own records.
- **Immutability:** Students cannot alter attendance records or timetable slots.
- **Leave Restrictions:** Students cannot approve their own leaves or modify leaves once actioned by the FA.

### 14. Performance Strategy
- **PWA Caching:** Static assets (logos, CSS, JS) and core API responses (Dashboard, Today's Timetable) are cached using `stale-while-revalidate`.
- **Pagination:** The Attendance Timeline utilizes infinite scrolling (cursor pagination) fetching 20 records at a time to keep DOM size small.
- **Lazy Loading:** Charts (Recharts/Chart.js) and the PDF generator library are lazy-loaded only when the student visits the Analytics or Reports tabs.

### 15. Audit Logging
- **Tracked Events:** `STUDENT_LOGIN`, `STUDENT_LOGOUT`, `LEAVE_REQUEST_SUBMITTED`, `LEAVE_REQUEST_CANCELLED`, `REPORT_DOWNLOADED`.
- **Purpose:** Analyzes portal engagement and provides an audit trail if a student claims they did not apply for a specific leave.

### 16. Testing Strategy
- **Unit Tests:** Verify frontend state management (Zustand) for notification counts.
- **Integration Tests:** Ensure the Dashboard API correctly aggregates data from the 3 underlying domain services.
- **Accessibility (A11y):** Automated Axe testing to ensure contrast ratios, ARIA labels on charts, and full keyboard navigability.
- **Responsive Testing:** Cypress visual regression tests across iPhone SE, iPad Pro, and 1080p Desktop viewports.

### 17. Student Portal Architecture Decision Record (ADR)
- **ADR-SP-001: Aggregated Dashboard API:** Chosen over RESTful chattiness. Instead of the frontend making 5 separate calls (Profile, Timetable, Stats, Notifications, Leave), a single `/dashboard` endpoint aggregates this to ensure instant TTI (Time to Interactive) on cellular networks.
- **ADR-SP-002: Bottom Navigation for Mobile:** Chosen over a hamburger menu to provide immediate, one-handed access to core modules (Timetable, Attendance), mimicking native iOS/Android academic apps.
- **ADR-SP-003: Client-Side Report Rendering:** Chosen to offload PDF generation to the browser (e.g., `jspdf` or `react-pdf`) to save backend CPU cycles, given that thousands of students might generate reports simultaneously at the end of a semester.
