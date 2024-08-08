import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import {ManagerService} from "../../../../shared/services/manager.service";
import {Project} from "../../../../shared/interfaces";
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent
} from "ng-zorro-antd/layout";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {ThemeService} from "../../../../shared/services/theme.service";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    JsonPipe,
    NzLayoutComponent,
    NzHeaderComponent,
    NzContentComponent,
    NzSiderComponent,
    NzFooterComponent,
    NzCardComponent,
    NzCardMetaComponent,
    NzSkeletonComponent,
    NzAvatarComponent,
    NzIconDirective,
    CdkVirtualScrollViewport,
    NzListComponent,
    CdkFixedSizeVirtualScroll,
    NzListItemComponent,
    NzListItemMetaComponent,
    CdkVirtualForOf,
    RouterOutlet,
    NzMenuDirective,
    NzMenuItemComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent implements OnInit {
  projectId = '';
  menuItems = [
    {title: 'Project Overview', icon: 'dashboard', link: 'overview'},
    {title: 'Board', icon: 'table', link: 'board'},
    {title: 'Tasks', icon: 'unordered-list', link: 'tasks'},
    {title: 'Members', icon: 'team', link: 'members'},
    // {title: 'Settings', icon: 'setting', link: 'settings'}
  ]
  isCollapsed: boolean = false;

  get project(): Project {
    return this.managerService.project
  }

  constructor(
    public router: Router,
    private managerService: ManagerService,
    private themeService: ThemeService,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.projectId = this.router.url.split('/')[3]
    this.init()
  }

  private fetchProject() {
    this.managerService.getProject(this.projectId).then((resp: any) => {
      if (resp !== 200) {
        console.error(resp)
        this.message.error('Failed to fetch project')
        return;
      }
    }).catch((err: any) => {
      console.error(err)
    })
  }

  private fetchProjectTasks() {

  }


  private init() {
    this.fetchProject()
    this.fetchProjectTasks()
  }


  goTo(item: any) {
    this.router.navigate([`/main/projects/${this.projectId}/${item.link}`])
  }

  getTheme() {
    if (this.themeService.theme === 'default') {
      return 'light'
    } else {
      return 'dark'
    }
  }
}
