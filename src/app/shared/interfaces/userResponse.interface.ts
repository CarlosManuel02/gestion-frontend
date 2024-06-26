import {User} from "./user.interface";

export interface UserResponse {
  user?:   User;
  token:  string;
  status: number;
  message?: string;
}
