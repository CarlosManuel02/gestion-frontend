import { Component } from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {ManagerService} from "../../../shared/services/manager.service";
import {
  NzListComponent, NzListItemActionComponent,
  NzListItemComponent,
  NzListItemExtraComponent,
  NzListItemMetaComponent, NzListItemMetaDescriptionComponent, NzListItemMetaTitleComponent
} from "ng-zorro-antd/list";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NzListComponent,
    NzRowDirective,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzListItemMetaTitleComponent,
    NzListItemMetaDescriptionComponent,
    NzEmptyComponent,
    NzButtonComponent,
    NzCardComponent,
    NzCardMetaComponent,
    NzAvatarComponent,
    NzColDirective,
    NzTableComponent,
    NzThMeasureDirective,
    NgForOf,
    NzInputGroupComponent,
    FormsModule,
    NzInputDirective,
    RouterLink
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  loading: boolean = false
  get projects() {
    return this.managerService.projects;

  }

  constructor(
    private managerService: ManagerService,
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.managerService.getProjects();
    this.loading = false;
  }
}
