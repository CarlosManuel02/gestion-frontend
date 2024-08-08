import {Component} from '@angular/core';
import {ManagerService} from "../../../shared/services/manager.service";
import {DatePipe, JsonPipe} from "@angular/common";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCarouselComponent, NzCarouselContentDirective} from "ng-zorro-antd/carousel";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzContentComponent, NzLayoutComponent} from "ng-zorro-antd/layout";
import {NzTypographyComponent} from "ng-zorro-antd/typography";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {TasksComponent} from "../tasks/tasks.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {ProjectsComponent} from "../../projects/pages/projects/projects.component";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {Router, RouterLink} from "@angular/router";
import {NzTransitionPatchDirective} from "ng-zorro-antd/core/transition-patch/transition-patch.directive";
import {Image, Project} from "../../../shared/interfaces/project.interface";
import {PriorityTagComponent} from "../../../shared/components/priority-tag/priority-tag.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    JsonPipe,
    NzCardComponent,
    NzTagComponent,
    DatePipe,
    NzCardMetaComponent,
    NzAvatarComponent,
    NzCarouselComponent,
    NzCarouselContentDirective,
    NzRowDirective,
    NzColDirective,
    NzLayoutComponent,
    NzContentComponent,
    NzTypographyComponent,
    NzPaginationComponent,
    NzDividerComponent,
    NzSkeletonComponent,
    NzListComponent,
    NzListItemComponent,
    TasksComponent,
    NzButtonComponent,
    NzEmptyComponent,
    ProjectsComponent,
    NzIconDirective,
    RouterLink,
    PriorityTagComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  userID!:string;

  get projects() {
    return this.managerService.projects;

  }

  constructor(
    private managerService: ManagerService,
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.userID = this.authService.user.id;
    this.getProjects()
  }

  getImage(data: Image) {
    if (!data) {
      return;
    }

    // Create a data URL from the image data
    const byteArray = new Uint8Array(data.data);
    const blob = new Blob([byteArray], {type: data.mime_type});
    const url = URL.createObjectURL(blob);
    return ';'

  }

  navigateToProject(project: Project) {
    this.managerService.getProject(project.project_id);
    this.router.navigateByUrl(`/main/projects/${ project.project_id }`)
  }

  private getProjects() {

    this.managerService.getProjects(this.userID).then((resp: any) => {
      if (resp !== 200) {
        this.message.error('An error occurred while fetching projects')
      }
    })
  }
}
