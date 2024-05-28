import {Injectable} from '@angular/core';
import {map, tap} from "rxjs";
import {Notification} from "../interfaces/notification.interface";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {NotificationResponse} from "../interfaces/notificationResponse.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
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
    console.log(this.authService.user.id)
    return this.http.get<NotificationResponse>(`http://localhost:8080/api/notifications/all/${this.authService.user.id}`).pipe(
      tap((resp) => {
        if (resp.status !== 200) {
          throw new Error(resp.message);
        } else {
          this._notifications = resp.notifications;
        }
      }
      ), map(() => this.notifications));
  }


}
