import type { User } from "@/models/User";

export interface Group {
  id: number;
  name: string;
  description: string;
  users: User[];
  image?: string;
  key?: string;
}
