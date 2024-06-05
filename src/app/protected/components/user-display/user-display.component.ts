import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Data, User} from "../../../shared/interfaces/user.interface";
import {AuthService} from "../../../shared/services/auth.service";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent
  ],
  template: `

    <nz-list nzSize="small">
      <nz-list-item>
        <nz-list-item-meta
          nzAvatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          [nzTitle]="usr?.username"
        >
        </nz-list-item-meta>
      </nz-list-item>
    </nz-list>

  `,
  styles: [`


  `]
})
export class UserDisplayComponent implements OnInit {

  @Input() userId: string = '';
  usr!: any;
  userImage: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
  }


  ngOnInit(): void {
    this.authService.getUser(this.userId)
      .then((resp) => {
        this.usr = resp[0];
      })
  }


}
