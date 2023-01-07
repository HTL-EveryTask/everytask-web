import type { User } from "@/models/User";

export interface Group {
  id: number;
  name: string;
  description: string;
  users: User[];
  picture?: string;
  key?: string;
}
