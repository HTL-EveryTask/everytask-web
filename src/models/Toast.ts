export interface Toast {
  id?: string;
  title: string;
  message: string;
  type?: "success" | "error" | "info" | "warning" | "default";
}
