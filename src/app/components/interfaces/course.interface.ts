import { Career } from "./careers.interface";

export interface Course {
  id?: number;
  code?: number;
  name?: string;
  credits?: number;
  hours?: number;
  careerId?: number;
}
