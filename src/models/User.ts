export interface User {
  id: number;
  username: string;
  isTeacher: boolean;
  email?: string;
  is_admin?: boolean;
}
