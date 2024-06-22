import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {Notification} from "../../interfaces/notification.interface";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NgForOf, NgIf} from "@angular/common";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NzBadgeComponent,
    NzListItemMetaComponent,
    NzListComponent,
    NzListItemComponent,
    NzButtonComponent,
    NzTooltipDirective,
    NzIconDirective,
    NgIf,
    NgForOf
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  @Input() notifications!: Notification[];
  @Output() notifyChanges: EventEmitter<Notification[]> = new EventEmitter<Notification[]>();
  private notificationsCount = 0;

  constructor(private notificationsService: NotificationsService) {
  }


  getDate(created_at: Date) {
    return new Date(created_at).toLocaleDateString();

  }


  markAsRead(notification: Notification) {

    this.notificationsService.markAllAsRead(notification.notification_id).subscribe((resp) => {

      this.notifications.forEach(notification => {
        notification.read = true;
      })
      this.getNotificationCount();
      this.notifyChanges.emit(this.notifications);

    });


  }

  private getNotificationCount() {
    this.notifications.forEach(notification => {
      if (!notification.read) {
        this.notificationsCount++;
      }
    })
  }
}
