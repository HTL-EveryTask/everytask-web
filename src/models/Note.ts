import type { User } from "@/models/User";

export interface Note {
  id: number;
  user: User;
  note: string;
}
