import type { Group } from "@/models/Group";
import type { User } from "@/models/User";
import type { Subject } from "@/models/Subject";

export interface Task {
  id: number;
  title: string;
  description: string;
  is_done: boolean;
  due_time: string;
  tags: string[];
  subject?: number | Subject;
  assigned_users: User[];
  assigned_groups: Group[];
  type: [];
}
