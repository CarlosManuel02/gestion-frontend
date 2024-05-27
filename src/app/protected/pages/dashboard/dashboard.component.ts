import { Component } from '@angular/core';
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
import {ProjectsComponent} from "../projects/projects.component";

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
    ProjectsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  array = [1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

  get projects() {
    return this.managerService.projects;

  }
  constructor(
    private managerService: ManagerService,
  ) { }

  ngOnInit() {
    this.managerService.getProjects();
  }

}
