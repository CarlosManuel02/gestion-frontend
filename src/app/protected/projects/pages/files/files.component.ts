import {Component, OnInit} from '@angular/core';
import {ManagerService} from "../../../../shared/services/manager.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../shared/services/auth.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [],
  templateUrl: './files.component.html',
  styleUrl: './files.component.less'
})
export class FilesComponent implements OnInit {

  projectId = '';

  constructor(
    private projectsService: ManagerService,
    public router: Router,
    private authService: AuthService,
    public message: NzMessageService,
  ) {

  }

  ngOnInit(): void {
    this.projectId = this.projectsService.projectID || this.router.url.split('/')[3];

  }


}
