export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR' | 'FACULTY_ADVISOR' | 'ADMIN';
}
