import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Data, User} from "../../../shared/interfaces/user.interface";
import {AuthService} from "../../../shared/services/auth.service";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {DomSanitizer} from "@angular/platform-browser";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCommentAvatarDirective} from "ng-zorro-antd/comment";

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzAvatarComponent,
    NzCommentAvatarDirective
  ],
  template: `

    @if (imageOnly){
      <nz-avatar nz-comment-avatar [nzText]="username" nzSize="default"></nz-avatar>
    } @else {
      <nz-list nzSize="small">
        <nz-list-item>
          <nz-list-item-meta
            [nzAvatar]="userImage"
            [nzTitle]="usr?.email"
          >
          </nz-list-item-meta>
        </nz-list-item>
      </nz-list>

      <ng-template #userImage>
        <nz-avatar nz-comment-avatar [nzText]="username" nzSize="small"></nz-avatar>
      </ng-template>
    }

  `,
  styles: [`


  `]
})
export class UserDisplayComponent implements OnInit {

  @Input({transform: (value: string | undefined): string => value || ''}) userId: string = '';
  usr!: any;
  userImage: string = '';
  @Input() imageOnly: boolean = false;
  username: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    // authService.getUser(this.userId)
    //   .subscribe((resp) => {
    //     console.log('resp', resp);
    //     this.usr = resp;
    //   })
  }


  ngOnInit(): void {
    this.authService.getUser(this.userId)
      .subscribe((resp) => {
        // console.log('resp', resp);
        this.usr = resp;
        // get the first letter of the username
        this.username = String(this.usr.email).charAt(0).toUpperCase();
      })
  }


}
