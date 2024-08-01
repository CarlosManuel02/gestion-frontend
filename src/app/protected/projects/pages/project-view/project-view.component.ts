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
    {title: 'Board', icon: 'table', link: 'board'},
    {title: 'Tasks', icon: 'unordered-list', link: 'tasks'},
    {title: 'Members', icon: 'team', link: 'members'},
    {title: 'Settings', icon: 'setting', link: 'settings'}
  ]
  isCollapsed: boolean = false;

  get project(): Project {
    return this.managerService.project
  }

  constructor(
    public router: Router,
    private managerService: ManagerService,
    private themeService: ThemeService
  ) {
  }

  ngOnInit(): void {
    this.projectId = this.router.url.split('/')[3]
    this.init()
  }

  private fetchProject() {
    this.managerService.getProject(this.projectId).then((resp: any) => {
      console.log(resp)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  private fetchProjectTasks() {

  }


  private init() {
    this.fetchProject()
    this.fetchProjectTasks()
  }

  getImage() {
    const data = this.project.image;
    if (!data) {
      return;
    }

    // Create a data URL from the image data
    const byteArray = new Uint8Array(data.data);
    const blob = new Blob([byteArray], {type: data.mime_type});
    const url = URL.createObjectURL(blob);
    return 'url';
  }


  goTo(item: any) {
    this.router.navigate([`/main/projects/${this.projectId}/${item.link}`])
    console.log('go to: /main/projects/' + this.project.project_id + '/' + item.link)
  }

  getTheme() {
    if (this.themeService.theme === 'default') {
      return 'light'
    } else {
      return 'dark'
    }
  }
}
