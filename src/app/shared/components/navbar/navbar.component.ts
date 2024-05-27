import {Component, OnInit} from '@angular/core';
import {NzMenuDirective, NzMenuGroupComponent, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {BehaviorSubject} from "rxjs";
import {ThemeService} from "../../services/theme.service";
import {Router, RouterModule} from "@angular/router";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {NzTabComponent, NzTabLinkTemplateDirective, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzHeaderComponent} from "ng-zorro-antd/layout";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {
  NzListComponent,
  NzListItemComponent,
  NzListItemMetaComponent,
  NzListItemMetaTitleComponent
} from "ng-zorro-antd/list";
import {AuthService} from "../../services/auth.service";
import {Data} from "../../interfaces/user.interface";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";

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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  theme = this.themeService.theme;

  public themeChanged$!: BehaviorSubject<ThemeType>;
  tabs: Tabs[] = [
    {
      name: 'Dashboard',
      link: 'dashboard',
      icon: 'dashboard',
      disabled: false
    },
    {
      name: 'Mis tareas',
      link: 'tasks',
      icon: 'file-search',
      disabled: false
    },
    {
      name: "Mis proyectos",
      link: 'projects',
      icon: 'project',
      disabled: false
    }
  ]
  selectedTab: Tabs = this.tabs[0];
  userImage!: string;

  get user() {
    return this.authService.user;
  }

  constructor(private router: Router,
              private themeService: ThemeService,
              private authService: AuthService
  ) {

  }


  ngOnInit(): void {
    this.themeChanged$ = this.themeService.getThemeChanged();
    this.theme = this.themeService.theme;
    this.getUserImage(this.user?.image?.data);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then(
      () => {
        this.theme = this.themeService.theme;
        console.log(this.theme);

      }
    );
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
      console.log(this.user)
      return;
    }

    // Convert the number array to a Uint8Array
    const byteArray = new Uint8Array(data.data);

    // Create a Blob from the byteArray
    const blob = new Blob([byteArray], { type: data.type });

    const  url = URL.createObjectURL(blob);
    console.log('url', url);
    this.userImage = url;
  }

}
