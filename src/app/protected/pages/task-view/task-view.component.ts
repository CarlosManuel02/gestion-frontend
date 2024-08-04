import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {TaskService} from "../../../shared/services/task.service";
import {Router, RouterLink} from "@angular/router";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
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
import {FileSizePipe} from "../../../shared/pipes/file-size.pipe";
import {NzTypographyComponent} from "ng-zorro-antd/typography";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {Data} from "../../../shared/interfaces/user.interface";
import {NzCollapseComponent, NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import {ManagerService} from "../../../shared/services/manager.service";
import {Member} from "../../../shared/interfaces";
import {NzCommentAvatarDirective, NzCommentComponent, NzCommentContentDirective} from "ng-zorro-antd/comment";
import {UserDisplayComponent} from "../../components/user-display/user-display.component";
import {CommentsComponent} from "../../../shared/components/comments/comments.component";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzAlertComponent} from "ng-zorro-antd/alert";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {PermissionService} from "../../../shared/services/permission.service";
import {RoleSetting} from "../../../shared/interfaces/permission.interface";

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
    NzDatePickerComponent,
    FileSizePipe,
    NzTypographyComponent,
    NzAvatarComponent,
    NzCollapseComponent,
    NzCollapsePanelComponent,
    NzCommentContentDirective,
    NzCommentComponent,
    NzCommentAvatarDirective,
    UserDisplayComponent,
    CommentsComponent,
    NgIf,
    RouterLink,
    NzSpinComponent,
    NzEmptyComponent,
    NzAlertComponent,
    NzPopconfirmDirective,
  ],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {

  loading = false;
  loadingAttachments = false;
  editMode = true;
  editModeDetails = true;
  settings: RoleSetting[] = [];
  @Input() task_id: string = '';

  priorities = [
    {label: 'Low', value: 1},
    {label: 'Medium', value: 2},
    {label: 'High', value: 3},
    {label: 'Urgent', value: 4},
  ]

  projectMembers: Member[] = []

  task: Task = {} as Task;

  get user() {
    return this.authService.user
  }

  mockTask: Task = {} as Task;
  statuses = [
    {label: 'Open', value: 'open'},
    {label: 'In Progress', value: 'in_progress'},
    {label: 'Completed', value: 'completed'},
    {label: 'Closed', value: 'closed'},
  ]
  inputValue: any;
  active: boolean = false
  canEdit: boolean = false;
  commentsLength: number = 0

  constructor(
    private taskService: TaskService,
    private managerService: ManagerService,
    private authService: AuthService,
    private router: Router,
    public message: NzMessageService,
    public permission: PermissionService

  ) {
  }

  ngOnInit(): void {
    this.getTask()
  }


  private getTask() {
    const taskId = this.task_id || this.router.url.split('/').pop()
    if (!taskId) {
      return
    }
    // console.log(taskId)
    this.taskService.getTask(taskId).subscribe((resp) => {
      if (resp.status !== 200) {
        this.message.error('Error getting task');
      } else {
        this.task = resp.task;
        this.task.task_priority = this.priorities.find(p => p.value === this.task.task_priority)?.label;
        this.task.task_status = this.statuses.find(s => s.value === this.task.task_status)?.label;
        this.getAttachments(taskId)
        this.mockTask = this.task
        this.getProjctMembers();
        this.getCurrentUser();
        this.getSettings();
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
        this.mockTask.attachments = this.task.attachments || []
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
    if (this.canEdit) {
      this.editMode = false
    } else {
    }
  }

  changeModeDetails() {
    this.editModeDetails = false
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
          // console.log(resp)
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

    // task_id?: string;
    // name: string;
    // description?: string;
    // status: string;
    // creation_date: string;
    // deadline?: string;
    // priority: number;
    // assignment?: string;
    // project_id?: string;
    const data = {
      task_id: this.mockTask.task_id,
      name: this.mockTask.task_name,
      description: this.mockTask.task_description,
      status: this.mockTask.task_status,
      creation_date: this.mockTask.task_creation_date,
      deadline: this.mockTask.task_deadline,
      priority: this.mockTask.task_priority,
      assignment: this.mockTask.user_email,
      project_id: this.mockTask.project_id,
    }
    this.loading = true;
    this.taskService.updateTask(this.task.task_id, data)
      .then((resp: any) => {
        this.loading = false;
        if (resp.status === 200) {
          this.message.success('Task updated successfully')
          this.editModeDetails = true;
          this.getTask()
        } else {
          this.message.error('Error updating task')
        }
      }, (error) => {
        this.loading = false;
        this.message.error('Error updating task')
      });
  }

  cancelDetails() {
    this.editModeDetails = true;
    this.mockTask = this.task;
  }

  private getProjctMembers() {
    // console.log(this.task)
    this.managerService.getProjecMembers(this.task.project_id)
      .then((resp: any) => {
        this.projectMembers = resp
        // console.log(this.projectMembers)
      })
  }

  onActiveChange($event: boolean) {
    this.active = $event

  }

  deleteFile(file: Files) {
    this.taskService.deleteAttachment(file.id)
      .then((resp) => {
        if (resp.status === 200) {
          this.message.success('File deleted successfully')
          this.getAttachments(this.task.task_id)
        } else {
          this.message.error('Error deleting file')
        }
      });

  }

  setCommentsLength($event: any) {
    this.commentsLength = $event;
  }

  private getSettings() {
    this.managerService.getProjectSettings(this.task.project_id)
      .then((resp: any) => {
        console.log('resp', resp);
        if (resp.status !== 200) {
          this.message.error(resp.message);
          return;
        } else {
          this.settings = resp.data.map((setting: RoleSetting) => {
            return {
              ...setting,
              dirty: false
            };
          });
        }
      }, error => {
        this.message.error('An error occurred while fetching settings');
        console.log(error);
      });
  }


  async getCurrentUser() {
    const user: any = await this.managerService.getProjecMembers(this.task.project_id).then(
      (resp: any) => {
        resp.forEach((member: Member) => {
          if (member.member_id === this.authService.user.id) {
            this.permission.checkPermission(member.member_role, 'update', this.settings, (hasPermission: boolean) => {
              this.canEdit = hasPermission;
              // console.log('canEdit', this.canEdit);
            });
          }
        });
      }
    );
  }

}
