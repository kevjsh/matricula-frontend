// Interfaces
import { Group } from './group.interface';
import { User } from './user.interface';

export interface Enrollment {
    id?: number;
    group?: Group;
    user?: User;
    grade?: number;
}