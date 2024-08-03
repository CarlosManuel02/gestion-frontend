import {Component, Input, OnInit} from '@angular/core';
import {ManagerService} from "../../../../shared/services/manager.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [],
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.less'
})
export class ProjectInfoComponent implements OnInit {
  @Input() projectId!: string;
  loading = false;

  constructor(
    private projectService: ManagerService,
    public message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.getProjectInfo();
  }


  private getProjectInfo() {
    this.loading = true;
    this.projectService.getProject(this.projectId).then((resp: any) => {
      this.loading = false;
      if (resp !== 200) {
        this.message.error('Error al obtener la información del proyecto');
        return;
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }
}
