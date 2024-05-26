import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../shared/services/task.service";
import {Router} from "@angular/router";
import {DatePipe, JsonPipe, NgForOf} from "@angular/common";
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
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {AuthService} from "../../../shared/services/auth.service";
import {NzFormDirective} from "ng-zorro-antd/form";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzMessageService} from "ng-zorro-antd/message";
import {CdkVirtualForOf, ScrollingModule} from "@angular/cdk/scrolling";
import {NzTableVirtualScrollDirective} from "ng-zorro-antd/table";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {Task} from "../../../shared/interfaces/task.interface";

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
    NzIconDirective,
    NzRowDirective,
    NzColDirective,
    NzFormDirective,
    NzSelectComponent,
    NzOptionComponent,
    NgForOf,
    ScrollingModule,
    NzDatePickerComponent
  ],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {

  loading = false;
  loadingAttachments = false;
  editMode = true;
  editModeDetails = true

  priorities = [
    {label: 'Low', value: 1},
    {label: 'Medium', value: 2},
    {label: 'High', value: 3},
    {label: 'Urgent', value: 4},
  ]

  get task() {
    return this.taskService.task
  }

  mockTask: Task = {} as Task;

  constructor(
    private taskService: TaskService,
    private router: Router,
    public message: NzMessageService,
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
        this.task.task_priority = this.priorities.find(p => p.value === this.task.task_priority)?.label
        this.getAttachments(taskId)
        this.mockTask = this.task
      }
    })
  }

  getAttachments(task_id: string | undefined) {
    this.loadingAttachments = true
    if (!task_id) {
      return
    }
    this.taskService.getAttachments(task_id).then((resp) => {
      this.loadingAttachments = false
      if (resp.status !== 200) {
        this.message.error('Error getting attachments')
      } else {
        console.log(resp)
        this.task.attachments = this.task.attachments || []
        console.log('Mock task', this.mockTask)
      }
    })
  }

  download(file: Files) {
    this.loading = true
    const uint8Array = new Uint8Array(file.data.data);
    const blob = new Blob([uint8Array], {type: file.mime_type});
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

  changeMode() {
    this.editMode = false
  }

  changeModeDetails() {
    this.editModeDetails = false
  }

  save() {

  }

  cancel() {
    this.editMode = true
    this.mockTask = this.task
  }

  uploadFile() {
    this.loadingAttachments = true
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.item(0);
      if (!file) {
        return
      }
      this.taskService.uploadAttachment(file, this.task.task_id)
        .then((resp: any) => {
          console.log(resp)
          this.loadingAttachments = false
          if (resp.status === 200) {
            this.getAttachments(this.task.task_id)
            this.message.success('File uploaded successfully')
          } else {
            // console.error('Error uploading file')
            this.message.error('Error uploading file')
          }
        })
    };
    input.click();
  }

  reload() {
    this.getAttachments(this.task.task_id)
  }

  saveDetails() {

  }

  cancelDetails() {
    this.editModeDetails = true;
    this.mockTask = this.task;
  }
}
