export interface User {
  id?: number;
  personId?: string;
  name: string;
  telephone?: number;
  birthday?: Date;
  careerId?: number | null;
  roleId?: number;
  email?: string;
  password?: string;
}