import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../shared/services/task.service";
import {Router} from "@angular/router";
import {DatePipe, JsonPipe} from "@angular/common";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {Files} from "../../../shared/interfaces/files.interface";
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from "ng-zorro-antd/descriptions";
import {NzBreadCrumbComponent, NzBreadCrumbItemComponent} from "ng-zorro-antd/breadcrumb";
import {NzAffixComponent} from "ng-zorro-antd/affix";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {FormsModule} from "@angular/forms";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [
    JsonPipe,
    NzCardComponent,
    NzCardMetaComponent,
    NzButtonComponent,
    NzButtonGroupComponent,
    DatePipe,
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    NzAffixComponent,
    NzListComponent,
    NzListItemComponent,
    NzDividerComponent,
    FormsModule,
    NzInputDirective,
    NzTagComponent,
    NzIconDirective
  ],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {

  loading = false
  get task() {
    return this.taskService.task
  }

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getTask()
  }


  private getTask() {
    const taskId = this.router.url.split('/').pop()
    if (!taskId) {
      return
    }
    // console.log(taskId)
    this.taskService.getTask(taskId).subscribe((resp) => {
      if (resp.status !== 200) {
        console.error('Error getting task')
      } else {
        console.log('Task:', this.task)
        this.getAttachments(taskId)
      }
    })
  }

  private getAttachments(task_id: string | undefined) {
    if (!task_id) {
      return
    }
    this.taskService.getAttachments(task_id).then((resp) => {
      if (resp.status !== 200) {
        console.error('Error getting attachments')
      } else {
        console.log(resp)
      }
    })
  }

  download(file: Files) {
    this.loading = true
    const uint8Array = new Uint8Array(file.data.data);
    const blob = new Blob([uint8Array], { type: file.mime_type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.loading = false
  }
}
