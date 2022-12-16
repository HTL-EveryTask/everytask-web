import type { Group } from "@/models/Group";
import type { User } from "@/models/User";

export interface Task {
  id: number;
  title: string;
  description: string;
  is_done: boolean;
  due_time: string;
  assigned_users: User[];
  assigned_groups: Group[];
  type: [];
}
