# CSE One

**Smart Attendance & Academic Analytics Platform**

Department of Computer Science and Engineering  
S.A. Engineering College  
Version: 1.0

## 1. Project Vision

CSE One is a centralized, secure, timetable-driven attendance and academic analytics platform designed exclusively for the Department of Computer Science and Engineering at S.A. Engineering College.

The objective is to eliminate manual attendance registers and spreadsheets by providing a digital platform that automates attendance, leave management, analytics, reporting, and faculty advisor workflows.

The system is designed as an enterprise-grade web application that can initially run on a local server and later migrate seamlessly to the college's infrastructure without changes to business logic.

## 2. Project Objectives

The system should:
- Digitize attendance.
- Reduce manual work.
- Automate attendance based on the timetable.
- Allow faculty advisors to manage students.
- Provide detailed attendance analytics.
- Generate professional reports.
- Maintain audit logs.
- Support future integration with the college server.

## 3. Core Modules

The architecture is built around five core modules:
1. **Academic Management:** Years, sections, subjects, timetable, faculty advisor assignments.
2. **Identity & Access Management (IAM):** Users, authentication, roles, permissions.
3. **Attendance Management:** Sessions, records, modifications, audit logs.
4. **Leave & Notification Management:** Student requests, faculty advisor approvals, notifications.
5. **Analytics & Reporting:** Dashboards, reports, trends.

## 4. Tech Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL (with SQLAlchemy ORM)
- **Authentication:** JWT & Argon2 Password Hashing
