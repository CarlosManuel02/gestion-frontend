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

  constructor(
    private manager: ManagerService,
    public router: Router,
    private authService: AuthService,
    public message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.fetchMembers();
  }

  private checkIfOwner() {
    this.manager.getProject(this.projectId).then((resp: any) => {
      console.log(resp);
    }).catch((err: any) => {
      console.log(err);
    });

    if (this.user.id === this.project.project_owner_id) {
      this.isOwner = true;
    } else {
      this.isOwner = false;
    }
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
    return this.manager.project;
  }

  protected readonly Date = Date;
  isVisible: boolean = false;

  removeMember(member: Member) {
    const data = {
      project_id: this.projectId,
      id: member.member_id
    }
    this.manager.removeMember(data)
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

    this.manager.addMember(data)
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
    this.manager.upodatemember(member)
      .then((resp) => {
        if (resp !== 200) {
          this.message.error("Something went wrong")
        }
      })
  }

  cancelEditMember(member: Member) {
    member.isEditing = false;
  }

  private fetchMembers() {
    this.projectId = this.router.url.split('/')[3];
    this.checkIfOwner();
    this.manager.getProjecMembers(this.projectId)
      .then((resp) => {
        console.log(resp);
        this.members = resp.map(member => ({...member, isEditing: false}));
      });
  }
}
