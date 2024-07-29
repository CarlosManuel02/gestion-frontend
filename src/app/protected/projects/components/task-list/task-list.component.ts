import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../../shared/services/task.service";
import {Task} from "../../../../shared/interfaces/task.interface";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {
  NzTableComponent,
  NzTableSortFn,
  NzTableSortOrder,
  NzThAddOnComponent,
  NzThMeasureDirective
} from "ng-zorro-antd/table";
import {UserDisplayComponent} from "../../../components/user-display/user-display.component";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {NotificationComponent} from "../../../../shared/components/notification/notification.component";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzCascaderComponent, NzCascaderOption} from "ng-zorro-antd/cascader";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    JsonPipe,
    NzButtonComponent,
    NzTableComponent,
    NzThMeasureDirective,
    DatePipe,
    NgForOf,
    UserDisplayComponent,
    NzTagComponent,
    NgIf,
    NzIconDirective,
    NzPopoverDirective,
    NotificationComponent,
    NzInputGroupComponent,
    FormsModule,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzCascaderComponent,
    NzThAddOnComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  loading = false;
  projectId!: string;

  priorities = [
    {label: 'Low', value: 1},
    {label: 'Medium', value: 2},
    {label: 'High', value: 3},
    {label: 'Urgent', value: 4},
  ]
  searchValue = 'status';
  options: NzCascaderOption[] = []
  currentOptions: NzCascaderOption[] | null = null;
  sortMap: NzTableSortOrder[] = [
    null,
    'ascend',
    'descend'
  ];
  sortTable: NzTableSortFn<any> = (a: any, b: any) => a.status - b.status;

  constructor(
    public taskService: TaskService,
    public router: Router,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.projectId = this.router.url.split('/')[3];
    this.getTasksFromProject();
  }


  getTasksFromProject() {
    this.loading = true;
    this.taskService.getTasksFromProject(this.projectId)
      .then((resp) => {
        this.loading = false;
        if (resp.status === 200) {
          this.tasks = resp.tasks;
        } else {
          // console.log('Error getting tasks')
          this.messageService.error('Error getting tasks');
          this.loading = false;
        }
      })
  }

  createTask() {

  }

  editTask(taskL: Task) {

  }

  deleteTask(task: Task) {

  }

  getPriority(task_priority: number | string | undefined) {
    return this.priorities.find(priority => priority.value === task_priority)?.label
  }

  viewTask(task: Task) {
    this.router.navigate([`/main/tasks/${task.task_id}`])
  }

  searchTask() {

  }

}
