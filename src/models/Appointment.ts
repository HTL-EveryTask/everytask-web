import type { Group } from "@/models/Group";
import type { User } from "@/models/User";
import type { Subject } from "@/models/Subject";
import type { Tag } from "@/models/Tag";

export interface Appointment {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  tags: string[] | Tag[];
  subject?: Subject;
  origin: string;
  assigned_users: User[];
  assigned_groups: Group[];
}
