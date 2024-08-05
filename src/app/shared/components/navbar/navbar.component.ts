import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzMenuDirective, NzMenuGroupComponent, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {BehaviorSubject, Subscription} from "rxjs";
import {ThemeService} from "../../services/theme.service";
import {Router, RouterModule} from "@angular/router";
import {AsyncPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {NzTabComponent, NzTabLinkTemplateDirective, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzHeaderComponent} from "ng-zorro-antd/layout";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {
  NzListComponent, NzListItemActionComponent,
  NzListItemComponent,
  NzListItemMetaComponent,
  NzListItemMetaTitleComponent
} from "ng-zorro-antd/list";
import {AuthService} from "../../services/auth.service";
import {Data} from "../../interfaces/user.interface";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {HttpClient} from "@angular/common/http";
import {Notification} from '../../interfaces/notification.interface';
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NotificationsService} from "../../services/notifications.service";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {environment} from "../../../../environments/environment";
import {NotificationComponent} from "../notification/notification.component";
import {UserDisplayComponent} from "../../../protected/components/user-display/user-display.component";


export enum ThemeType {
  Dark = 'dark',
  Default = 'default',
}

interface Tabs {
  name: string;
  link: string;
  icon: string;
  disabled: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NzMenuDirective,
    NzMenuGroupComponent,
    NzMenuItemComponent,
    NzTooltipDirective,
    AsyncPipe,
    NgIf,
    NzIconDirective,
    NzTabSetComponent,
    NzTabLinkTemplateDirective,
    NzTabComponent,
    RouterModule,
    NzHeaderComponent,
    NzButtonComponent,
    NzIconModule,
    NgClass,
    NzAvatarComponent,
    NzPopoverDirective,
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaTitleComponent,
    NzListItemMetaComponent,
    NzPopconfirmDirective,
    NgForOf,
    NzBadgeComponent,
    JsonPipe,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    DatePipe,
    NotificationComponent,
    NzListItemActionComponent,
    UserDisplayComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  theme = this.themeService.theme;
  public themeChanged$!: BehaviorSubject<ThemeType>;
  tabs: Tabs[] = [
    {name: 'Dashboard', link: 'dashboard', icon: 'dashboard', disabled: false},
    {name: 'Mis tareas', link: 'tasks', icon: 'file-search', disabled: false},
    {name: 'Mis proyectos', link: 'projects', icon: 'project', disabled: false}
  ];
  selectedTab: Tabs = this.tabs[0];
  userImage!: string;
  notifications: Notification[] = [];
  private eventSource!: EventSource;
  private notificationSubscription!: Subscription;
  notificationsCount = 0;

  get user() {
    return this.authService.user;
  }

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private nzNotification: NzNotificationService
  ) {
  }

  ngOnInit(): void {
    this.themeChanged$ = this.themeService.getThemeChanged();
    this.theme = this.themeService.theme;
    this.getUserImage(this.user?.image?.data);
    if (!this.eventSource) { // Verifica si eventSource ya está inicializado
      this.getAllNotifications();
      this.initNotifications();
    }
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then(() => {
      this.theme = this.themeService.theme;
    });
  }

  logout() {
    this.authService.logout();
  }

  chekTheme() {
    return this.themeService.theme === ThemeType.Dark;
  }

  private getUserImage(data: Data | undefined) {
    if (!data) {
      this.userImage = 'assets/images/user.png';
      return;
    }

    const byteArray = new Uint8Array(data.data);
    const blob = new Blob([byteArray], {type: data.type});
    const url = URL.createObjectURL(blob);
    this.userImage = url;
  }

  private initNotifications() {
    const endpoint = environment.ApiEndPoint + 'notifications/notify';
    this.eventSource = new EventSource(endpoint);
    this.eventSource.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data);
      this.notifications.push(notification);
      this.notificationsCount = this.notifications.length;
      console.log('Notification:', notification);
    };
    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
    };
  }

  private getAllNotifications() {
    this.notificationsService.getAllMotifications()
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
  }

  protected readonly Date = Date;

  getDate(created_at: Date) {
    return new Date(created_at).toLocaleDateString();

  }

  onVisibleChange($event: boolean) {
    if (!$event) {
      // TODO: Marcar todas las notificaciones como leídas
    }
  }



  onNotifyChanges($event: Notification[]) {
    this.notifications = $event;
  }
}
