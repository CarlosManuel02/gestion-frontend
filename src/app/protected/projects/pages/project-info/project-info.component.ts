import {Component, Input, OnInit} from '@angular/core';
import {ManagerService} from "../../../../shared/services/manager.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {RoleSetting} from "../../../../shared/interfaces/permission.interface";
import {Member} from "../../../../shared/interfaces";
import {AuthService} from "../../../../shared/services/auth.service";
import {PermissionService} from "../../../../shared/services/permission.service";
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from "ng-zorro-antd/descriptions";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {DatePipe, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    NzBadgeComponent,
    DatePipe,
    NgIf,
    NzButtonComponent
  ],
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.less'
})
export class ProjectInfoComponent implements OnInit {
  @Input() projectId!: string;
  loading = false;
  canEdit: boolean = true;
  showEditModal = false;
  private settings: RoleSetting[] = [];

  constructor(
    private projectService: ManagerService,
    public message: NzMessageService,
    private authService: AuthService,
    private permission: PermissionService
  ) {
  }

  get project() {
    return this.projectService.project;
  }

  ngOnInit(): void {
    this.getProjectInfo();
    this.getSettings();
    this.getCurrentUser();
  }


  private getProjectInfo() {
    this.loading = true;
    this.projectService.getProject(this.projectId).then((resp: any) => {
      this.loading = false;
      if (resp !== 200) {
        this.message.error('Error al obtener la información del proyecto');
        return;
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  private getSettings() {
    this.projectService.getProjectSettings(this.projectId)
      .then((resp: any) => {
        console.log('resp', resp);
        if (resp.status !== 200) {
          this.message.error(resp.message);
          return;
        } else {
          this.settings = resp.data.map((setting: RoleSetting) => {
            return {
              ...setting,
              dirty: false
            };
          });
        }
      }, error => {
        this.message.error('An error occurred while fetching settings');
        console.log(error);
      });
  }


  async getCurrentUser() {
    const user: any = await this.projectService.getProjecMembers(this.projectId).then(
      (resp: any) => {
        resp.forEach((member: Member) => {
          if (member.member_id === this.authService.user.id) {
            this.permission.checkPermission(member.member_role, 'update', this.settings, (hasPermission: boolean) => {
              this.canEdit = !hasPermission;
              // console.log('canEdit', this.canEdit);
            });
          }
        });
      }
    );
  }

  editProject() {
    this.showEditModal = true;
  }
}
