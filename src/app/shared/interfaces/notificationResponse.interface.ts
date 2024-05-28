import { Notification } from './notification.interface';
export interface NotificationResponse{
  notifications: Notification[];
  count: number;
  status: number;
  message?: string;
}
