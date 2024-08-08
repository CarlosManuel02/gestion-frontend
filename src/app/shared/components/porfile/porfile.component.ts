import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../interfaces";
import {ManagerService} from "../../services/manager.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from "ng-zorro-antd/descriptions";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {DatePipe, NgIf} from "@angular/common";
import {ProjectsComponent} from "../../../protected/projects/pages/projects/projects.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {TaskListComponent} from "../../../protected/components/task-list/task-list.component";

@Component({
  selector: 'app-porfile',
  standalone: true,
  imports: [
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    NzCardComponent,
    NzListComponent,
    NzListItemComponent,
    NzEmptyComponent,
    RouterLink,
    NzListItemMetaComponent,
    DatePipe,
    NgIf,
    ProjectsComponent,
    NzDividerComponent,
    NzButtonComponent,
    NzRowDirective,
    NzColDirective,
    TaskListComponent
  ],
  templateUrl: './porfile.component.html',
  styleUrl: './porfile.component.less'
})
export class PorfileComponent implements OnInit {

  userId = ''
  user: User = null as any;
  isCurrentUser: boolean = false;

  get projects() {
    return this.projectService.projects
  }

  constructor(
    public router: Router,
    private authService: AuthService,
    private projectService: ManagerService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.userId = this.router.url.split('/')[3]
    this.getUser();
    this.getUserProjects();
    console.log(this.user)
    console.log(this.projects)
  }


  private getUserProjects() {
    this.projectService.getProjects(this.userId).then((resp: any) => {
      if (resp !== 200) {
        this.message.error('An error occurred while fetching projects')
      }
    })
  }

  editProfile() {

  }

  private getUser() {
    this.authService.getUser(this.userId)
      .subscribe((res) => {
        if (res) {
          this.user = res.user[0];
          this.isCurrentUser = this.authService.user.id === this.user.id;
        } else {
          this.message.error(res.message);
          console.error(res);
        }
      }, error => {
        this.message.error('User not found');
      });
  }
}
