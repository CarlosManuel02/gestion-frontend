import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {DomSanitizer} from "@angular/platform-browser";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCommentAvatarDirective} from "ng-zorro-antd/comment";
import {User} from "../../../shared/interfaces";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzAvatarComponent,
    NzCommentAvatarDirective,
    NgIf
  ],
  template: `
    <ng-container *ngIf="usr && usr.length > 0; else noUser">
      <ng-container *ngIf="imageOnly; else userDetails">
        <nz-avatar nz-comment-avatar [nzText]="username" nzSize="default"></nz-avatar>
      </ng-container>
      <ng-template #userDetails>
        <nz-list nzSize="small">
          <nz-list-item>
            <nz-list-item-meta
              [nzAvatar]="userImage"
              [nzTitle]="usr[0]?.email"
            >
            </nz-list-item-meta>
          </nz-list-item>
        </nz-list>

        <ng-template #userImage>
          <nz-avatar nz-comment-avatar [nzText]="usr[0]?.email.slice(0, 1)?.toUpperCase()"
                     nzSize="small"></nz-avatar>
        </ng-template>
      </ng-template>
    </ng-container>
    <ng-template #noUser>
      <p>No user data available</p>
    </ng-template>
  `,
  styles: [`


  `]
})
export class UserDisplayComponent implements OnInit {
  @Input({transform: (value: string | undefined): string => value || ''}) userId: string = '';
  usr: any[] = [];
  userImage: string = '';
  @Input() imageOnly: boolean = false;
  username: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getUser(this.userId)
      .subscribe((resp: any) => {
        this.usr = resp;
        if (this.usr && this.usr.length > 0) {
          this.username = this.usr[0].email.charAt(0).toUpperCase();
        }
      }, (error) => {
        console.error('Error fetching user data:', error);
        this.usr = [];
      });
  }
}
