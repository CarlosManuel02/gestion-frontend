import {Injectable} from '@angular/core';
import {map, tap} from "rxjs";
import {Notification} from "../interfaces/notification.interface";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {NotificationResponse} from "../interfaces/notificationResponse.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private endpoint = environment.ApiEndPoint + 'notifications/';
  private _notifications: Notification[] = [];
  get notifications(): Notification[] {
    return [...this._notifications]
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
  }


  getAllMotifications() {
    return this.http.get<NotificationResponse>(`${this.endpoint}all/${this.authService.user.id}`).pipe(
      tap((resp) => {
        if (resp.status !== 200) {
          throw new Error(resp.message);
        } else {
          this._notifications = resp.notifications;
        }
      }
      ), map(() => this.notifications));
  }


  markAllAsRead(notification: string) {
    return this.http.post<NotificationResponse>(`${this.endpoint}read/${notification}`, {}).pipe(
      tap((resp) => {
        if (resp.status !== 200) {
          throw new Error(resp.message);
        }
      }
      ), map(() => this.notifications));
  }
}
