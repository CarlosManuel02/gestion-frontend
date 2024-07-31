import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from "../../../shared/services/auth.service";
import { NzAvatarComponent } from "ng-zorro-antd/avatar";
import { DomSanitizer } from "@angular/platform-browser";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [
    NzAvatarComponent,
    NgIf
  ],
  template: `
    <ng-container *ngIf="usr && usr.length > 0; else noUser">
      <ng-container *ngIf="imageOnly; else userDetails">
        <nz-avatar [nzText]="username" nzSize="default"></nz-avatar>
      </ng-container>
      <ng-template #userDetails>
        <div class="user-display">
          <nz-avatar [nzText]="usr[0]?.email.slice(0, 1)?.toUpperCase()" nzSize="small"></nz-avatar>
          <span class="user-email">{{ usr[0]?.email }}</span>
        </div>
      </ng-template>
    </ng-container>
    <ng-template #noUser>
      <p>No user data available</p>
    </ng-template>
  `,
  styles: [`
    .user-display {
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
    }
    .user-email {
      margin-left: 8px;
      vertical-align: middle;
    }
  `]
})
export class UserDisplayComponent implements OnInit {
  @Input({ transform: (value: string | undefined): string => value || '' }) userId: string = '';
  usr: any[] = [];
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
