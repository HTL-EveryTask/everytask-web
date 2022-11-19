import type { User } from "@/models/User";

export interface Group {
  id: string;
  name: string;
  description: string;
  users: User[];
  admins: User[];
}
