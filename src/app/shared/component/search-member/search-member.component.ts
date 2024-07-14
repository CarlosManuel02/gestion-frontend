import {Component, EventEmitter, Output} from '@angular/core';
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
  user!: User;
  users: any[] = [];
  role = 'member';


  constructor(
    public authService: AuthService,
  ) {
  }

  searchUser() {
    this.authService.getUser(this.email)
      .subscribe((res) => {
        this.user = res;
        console.log('user', this.user)
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
    this.user = {} as User;
  }
}