import {Component, OnInit, signal} from '@angular/core';
import {ManagerService} from "../../../../shared/services/manager.service";
import {Router} from "@angular/router";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NzTableComponent, NzTbodyComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {UserDisplayComponent} from "../../../components/user-display/user-display.component";
import {Member} from "../../../../shared/interfaces";
import {AuthService} from "../../../../shared/services/auth.service";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {SearchMemberComponent} from "../../../../shared/components/search-member/search-member.component";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {RoleSetting} from "../../../../shared/interfaces/permission.interface";
import {PermissionService} from "../../../../shared/services/permission.service";
import {NzFlexDirective} from "ng-zorro-antd/flex";

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    JsonPipe,
    NzTableComponent,
    NzTbodyComponent,
    UserDisplayComponent,
    NzButtonComponent,
    NzPopoverDirective,
    NzIconDirective,
    NzButtonGroupComponent,
    NzSelectComponent,
    NzOptionComponent,
    FormsModule,
    NgForOf,
    NgIf,
    NzThMeasureDirective,
    DatePipe,
    NzDividerComponent,
    NzModalComponent,
    NzModalContentDirective,
    SearchMemberComponent,
    NzPopconfirmDirective,
    NzFlexDirective
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {

  projectId = '';
  members: Member[] = []
  isOwner = false;
  canCreate: boolean = false;
  settings: RoleSetting[] = [];


  constructor(
    private projectsService: ManagerService,
    public router: Router,
    private authService: AuthService,
    public message: NzMessageService,
    public permission: PermissionService

  ) {
  }

  ngOnInit(): void {
    this.fetchMembers();
    this.getProject();
    this.getCurrentUser();
    this.getSettings();
  }

  private checkIfOwner() {
    this.isOwner = this.user.id === this.project.project_owner_id;
  }

  editMemberRole(member: Member) {
    member.isEditing = !member.isEditing;

  }

  trackByMemberId(index: number, member: Member): string {
    return member.member_id;
  }

  get user() {
    return this.authService.user;
  }

  get project() {
    return this.projectsService.project;
  }

  protected readonly Date = Date;
  isVisible: boolean = false;

  removeMember(member: Member) {
    const data = {
      project_id: this.projectId,
      id: member.member_id
    }
    this.projectsService.removeMember(data)
      .then((resp) => {
        if (resp === 200) {
          this.members = this.members.filter(m => m.member_id !== member.member_id);
        } else {
          this.message.error("Something went wrong");
        }
      });
  }

  addMember() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

  getSelectedMembers($event: any) {
    let data = {
      project_id: this.projectId,
      id: $event[0].id,
      role: $event[0].role
    }

    this.projectsService.addMember(data)
      .then((resp) => {
        if (resp === 200) {
          this.fetchMembers();
        } else {
          this.message.error("Something went wrong");
        }
      });


  }

  saveMember(member: Member) {
    const data = {
      'project_id': this.projectId,
      'id': member.member_id,
      'role': member.member_role
    }
    this.projectsService.upodatemember(data)
      .then((resp: any) => {
        if (resp.status !== 200) {
          this.message.error("Something went wrong")
        }
      })
  }

  cancelEditMember(member: Member) {
    member.isEditing = false;
  }

  private fetchMembers() {
    this.projectId = this.projectsService.projectID || this.router.url.split('/')[3];
    this.projectsService.getProjecMembers(this.projectId)
      .then((resp) => {
        this.members = resp.map(member => ({...member, isEditing: false}));
      });
  }

  private getProject() {
    this.projectsService.getProject(this.projectId)
      .then((resp) => {
        this.checkIfOwner();
      });
  }

  async getCurrentUser() {
    const user: any = await this.projectsService.getProjecMembers(this.projectId).then(
      (resp: any) => {
        resp.forEach((member: Member) => {
          if (member.member_id === this.authService.user.id) {
            this.permission.checkPermission(member.member_role, 'create', this.settings, (hasPermission: boolean) => {
              this.canCreate = hasPermission;
            });
          }
        });
      }
    );
  }

  private getSettings() {
    this.projectsService.getProjectSettings(this.projectId)
      .then((resp: any) => {
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

  goToUser(member_id: string) {
    this.router.navigate(['/main/profile', member_id]);
  }

  leaveProject() {
    const data = {
      project_id: this.projectId,
      id: this.user.id
    }
    this.projectsService.leaveProject(data)
      .then((resp) => {
        if (resp === 200) {
          this.router.navigate(['/main/projects']);
        } else {
          this.message.error("Something went wrong");
        }
      });

  }
}
