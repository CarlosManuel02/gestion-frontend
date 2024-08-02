import {Component, OnInit} from '@angular/core';
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {SettingsComponent} from "../settings/settings.component";
import {ProjectInfoComponent} from "../project-info/project-info.component";
import {ManagerService} from "../../../../shared/services/manager.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    NzTabSetComponent,
    NzTabComponent,
    SettingsComponent,
    ProjectInfoComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.less'
})
export class OverviewComponent implements OnInit {
  projectId!:string;
  constructor(
    private projectService: ManagerService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.projectId = this.projectService.projectID || this.router.url.split('/')[3];
  }

}
