import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {
  NzListComponent,
  NzListItemComponent,
  NzListItemExtraComponent,
  NzListItemMetaComponent
} from "ng-zorro-antd/list";
import {Task} from "../../../shared/interfaces/task.interface";
import {TaskService} from "../../../shared/services/task.service";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    NzBadgeComponent,
    NzButtonComponent,
    NzEmptyComponent,
    NzIconDirective,
    NzListComponent,
    NzListItemComponent,
    NzListItemExtraComponent,
    NzListItemMetaComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  @Input() filter!: string;
  @Input() projectId!: string;
  @Input() user!: any;

  @Output() onTaskClick: EventEmitter<Task> = new EventEmitter<Task>();

  tasks: Task[] = [];
  loading: boolean = false;


  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    public message: NzMessageService
  ) {
  }

  ngOnInit() {
    this.init().then(() => {
      if (this.filter) {
        this.tasks = this.tasks.filter(task => task.task_status === this.filter);
      }
    })

  }

  private async getTasksFromUser() {
    this.loading = true;
    await this.taskService.getTasksFromUser(this.user.email)
      .then((resp) => {
        this.loading = false;
        if (resp.status === 200) {
          this.tasks = resp.tasks;
        } else {
          this.message.error('Error getting tasks');
          this.loading = false;
        }
      })

  }

  private async getTasksFromProject() {
    this.loading = true;
    await this.taskService.getTasksFromProject(this.projectId)
      .then((resp) => {
        this.loading = false;
        if (resp.status === 200) {
          this.tasks = resp.tasks;
        } else {
          this.message.error('Error getting tasks');
          this.loading = false;
        }
      })
  }

  private async init() {
    if (this.projectId) {
      await this.getTasksFromProject();
    } else {
      await this.getTasksFromUser();
    }
  }

  taskClick(task: Task) {
    this.onTaskClick.emit(task);
  }

  getStatusType(task_status: string | undefined) {
    switch (task_status) {
      case 'open':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'closed':
        return 'red';
      default:
        return 'blue';
    }

  }

  getStatus(task_status: string | undefined) {
    switch (task_status) {
      case 'open':
        return 'Open'
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed'
      case 'closed':
        return 'Closed';
      default:
        return 'Open';
    }
  }

  getDate(task_deadline: Date) {
    return new Date(task_deadline).toLocaleDateString();
  }
}
