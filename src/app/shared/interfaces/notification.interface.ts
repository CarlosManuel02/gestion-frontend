export interface Notification{
  notification_id: string;
  title: string;
  from_user: string;
  to_user: string;
  message: string;
  created_at: Date;
  read: boolean;
}
