import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges} from '@angular/core';
import {NzMenuDirective, NzMenuGroupComponent, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {BehaviorSubject} from "rxjs";
import {ThemeService} from "../../sevices/theme.service";
import {Router, RouterModule} from "@angular/router";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {NzTabComponent, NzTabLinkTemplateDirective, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzHeaderComponent} from "ng-zorro-antd/layout";
import {NzButtonComponent} from "ng-zorro-antd/button";

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
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() isCollapsed = false;
  @Input() isMobile = false;
  @Output() isCollapsedChanged = new EventEmitter<boolean>();
  // menuItems = menuItems;
  // submenuItems = submenuItems;
  currentPath!: string;
  public ThemeType = ThemeType;
  nzSelected= false;
  theme = this.themeService.theme;
  mode = false;

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

  constructor(private router: Router,
              private themeService: ThemeService,
              private renderer: Renderer2,
              private el: ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isMobile']) {
      const divGenerado = this.el.nativeElement.querySelector('.ant-affix');
      if (divGenerado) {
        this.renderer.addClass(divGenerado, 'collapsed-affix');
      }
    }
  }

  ngOnInit(): void {
    this.themeChanged$ = this.themeService.getThemeChanged();
    this.theme = this.themeService.theme;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then(
      () => {
        this.theme = this.themeService.theme;
        console.log(this.theme);

      }

    );
  }

  close(): void {
    this.isCollapsed = this.isCollapsed;
    this.isCollapsedChanged.emit(!this.isCollapsed);
  }

  logout() {

  }

  chekTheme() {
    return this.themeService.theme === ThemeType.Dark;
  }
}
