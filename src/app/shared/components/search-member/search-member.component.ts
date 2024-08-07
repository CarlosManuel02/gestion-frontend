import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {AuthService} from "../../services/auth.service";
import {User} from "../../interfaces";
import {NzTableComponent} from "ng-zorro-antd/table";
import {JsonPipe, NgIf} from "@angular/common";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {UserDisplayComponent} from "../../../protected/components/user-display/user-display.component";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzMessageService} from "ng-zorro-antd/message";
import {ManagerService} from "../../services/manager.service";

@Component({
  selector: 'app-search-member',
  standalone: true,
  imports: [
    NzInputDirective,
    FormsModule,
    NzInputGroupComponent,
    NzButtonComponent,
    NzIconDirective,
    NzTableComponent,
    JsonPipe,
    NzSelectComponent,
    NzOptionComponent,
    NzButtonGroupComponent,
    UserDisplayComponent,
    NgIf,
    NzCardComponent,
    NzCardMetaComponent,
    NzAvatarComponent
  ],
  templateUrl: './search-member.component.html',
  styleUrl: './search-member.component.scss'
})
export class SearchMemberComponent {
  @Output() selectedMembers = new EventEmitter();
  email = '';
  user: User = null as any;
  users: any[] = [];
  role!: string;
  isInProject = false;
  @Input() projectId!: string;


  constructor(
    public authService: AuthService,
    public message: NzMessageService,
    private projectService: ManagerService
  ) {
  }

  searchUser() {
    this.authService.getUser(this.email)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.user = res.user;
          this.userInProject();
        } else {
          this.message.error(res.message);
          console.error(res);
        }
      }, error => {
        this.message.error('User not found');
      });
  }

  addMember() {
    this.users.push({
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      role: this.role
    });
    this.user = null as any;
    this.email = '';
    this.selectedMembers.emit(this.users);
  }

  clear() {
    this.user = null as any;
    this.email = '';
  }

  private userInProject() {
    const id = this.user.id;
    this.projectService.getProjecMembers(this.projectId).then((res) => {
      if (res) {
        const user = res.find((user: any) => user.member_id === id);
        console.log(user);
        if (user) {
          this.message.error('User already in project');
          this.isInProject = true;
        }
      }
    });

  }
}
