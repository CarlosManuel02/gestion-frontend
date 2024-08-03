import {Component} from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {ManagerService} from "../../../../shared/services/manager.service";
import {
  NzListComponent, NzListItemActionComponent,
  NzListItemComponent,
  NzListItemExtraComponent,
  NzListItemMetaComponent, NzListItemMetaDescriptionComponent, NzListItemMetaTitleComponent
} from "ng-zorro-antd/list";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UserDisplayComponent} from "../../../components/user-display/user-display.component";
import {Image, Project} from "../../../../shared/interfaces/project.interface";
import {NzDrawerComponent, NzDrawerContentDirective, NzDrawerService} from "ng-zorro-antd/drawer";
import {CreateProjectComponent} from "../../components/create-project/create-project.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTagComponent} from "ng-zorro-antd/tag";

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
    RouterLink,
    UserDisplayComponent,
    NzButtonGroupComponent,
    NzDrawerComponent,
    CreateProjectComponent,
    NzDrawerContentDirective,
    DatePipe,
    NzTagComponent,
    NgIf
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  loading: boolean = false;
  isVisible = false;

  get projects() {
    return this.managerService.projects;

  }

  constructor(
    private managerService: ManagerService,
    public drawer: NzDrawerService,
    private router: Router,
    private message: NzMessageService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.managerService.getProjects();
    this.loading = false;
  }

  createProject() {
    this.isVisible = true;
    // this.drawer.create({
    //   nzTitle: 'Create a new project',
    //   nzContent: CreateProjectComponent,
    //   nzWidth: 600
    // });

  }

  setProject(project: Project) {
    this.managerService.getProject(project.project_id)
    // console.log('setProject', )
    this.router.navigateByUrl(`/main/projects/${project.project_id}`)
  }

  closeDrawer() {
    this.isVisible = false;
  }

  onProjectCreated($event: any) {
    this.isVisible = false;
    this.managerService.getProjects();
    this.message.success($event);

  }
}
