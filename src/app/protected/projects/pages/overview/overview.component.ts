import {Component, OnInit} from '@angular/core';
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {SettingsComponent} from "../settings/settings.component";
import {ProjectInfoComponent} from "../project-info/project-info.component";
import {ManagerService} from "../../../../shared/services/manager.service";
import {Router} from "@angular/router";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {AuthService} from "../../../../shared/services/auth.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {FormsModule} from "@angular/forms";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzTypographyComponent} from "ng-zorro-antd/typography";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    NzTabSetComponent,
    NzTabComponent,
    SettingsComponent,
    ProjectInfoComponent,
    NzIconDirective,
    NzButtonComponent,
    NzModalComponent,
    NzModalContentDirective,
    NzModalFooterDirective,
    NzDividerComponent,
    FormsModule,
    NzInputDirective,
    NzTypographyComponent,
    NzInputGroupComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.less'
})
export class OverviewComponent implements OnInit {
  projectId!: string;
  canEnter: boolean = false;
  isVisible = false;
  isConfirmVisible = false;

  get project() {
    return this.projectService.project;
  }


  constructor(
    private projectService: ManagerService,
    public router: Router,
    private authService: AuthService,
    private modal: NzModalService,
    public message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.projectId = this.projectService.projectID || this.router.url.split('/')[3];
    this.getCurrentUser();
  }

  async getCurrentUser() {
    const user: any = await this.projectService.getProjecMembers(this.projectId).then(
      (resp: any) => {
        resp.forEach((member: any) => {
          if (member.member_id === this.authService.user.id) {
            this.canEnter = member.member_role === 'admin' || member.member_role === 'owner';
          }
        });
      }
    );
  }

  openModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  deleteProject(): void {
    this.projectService.deleteProject(this.projectId).then((resp: any) => {
      if (resp.status === 200) {
        this.router.navigate(['/dashboard']);
        this.message.success('Project deleted successfully');
      } else {
        this.message.error('Error deleting project');
      }
    }).catch(error => {
      console.error('Error deleting project:', error);
    });
    this.isVisible = false;
  }

  protected readonly confirm = confirm;
  projectName!: string;

  confirmDelete() {
    this.isConfirmVisible = true;
  }
}
