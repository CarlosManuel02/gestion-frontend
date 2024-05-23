import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./shared/components/navbar/navbar.component";
import {NzContentComponent, NzLayoutComponent} from "ng-zorro-antd/layout";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {ThemeService} from "./shared/services/theme.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NzLayoutComponent, NzContentComponent, NzDividerComponent, NzButtonComponent, NzSelectComponent, NzOptionComponent, NzIconDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  gitlab = 'https://gitlab.com/Carlos020'
  github = 'https://github.com/CarlosManuel02'



}
