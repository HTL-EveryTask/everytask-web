import type { Group } from "@/models/Group";
import type { User } from "@/models/User";
import type { Subject } from "@/models/Subject";
import type { Note } from "@/models/Note";
import type { SubTask } from "@/models/SubTask";
import type { Tag } from "@/models/Tag";

export interface Task {
  id: number;
  title: string;
  description: string;
  is_done: boolean;
  due_time: string;
  tags: string[] | Tag[];
  subject?: Subject;
  note?: Note[];
  subtasks?: SubTask[];
  origin: string;
  assigned_users: User[];
  assigned_groups: Group[];
  type: [];
}
