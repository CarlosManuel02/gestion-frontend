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
    NzPopconfirmDirective
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {

  projectId = '';
  members: Member[] = []
  isOwner = false;
  canCreate: boolean = false;

  constructor(
    private projectsService: ManagerService,
    public router: Router,
    private authService: AuthService,
    public message: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.fetchMembers();
    this.getProject();
    this.getCurrentUser();
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

    // console.log(data);

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
        resp.forEach((member: any) => {
          if (member.member_id === this.authService.user.id) {
            this.canCreate = member.member_role === 'admin' || member.member_role === 'owner';
          }
        });
      }
    );
  }
}
