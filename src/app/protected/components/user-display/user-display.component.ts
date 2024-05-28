import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Data, User} from "../../../shared/interfaces/user.interface";
import {AuthService} from "../../../shared/services/auth.service";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";

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
          [nzAvatar]="userImage"
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
    private authService: AuthService,
  ) {
  }


  ngOnInit(): void {
    this.authService.getUser(this.userId)
      .then((resp) => {
        this.usr = resp[0];
        this.getUserImage(this.usr?.image);
      })
  }

  getUserImage(data: Data | undefined) {
    if (!data) {
      this.userImage = 'assets/images/user.png';
      return;
    }

    const byteArray = new Uint8Array(data.data);
    const blob = new Blob([byteArray], {type: data.type});
    const url = URL.createObjectURL(blob);
    this.userImage = url;
    console.log('userImage', this.userImage)
  }


}
