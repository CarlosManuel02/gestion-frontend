import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {TaskService} from "../../../shared/services/task.service";
import {JsonPipe, NgStyle} from "@angular/common";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  NzListComponent, NzListEmptyComponent, NzListHeaderComponent,
  NzListItemComponent,
  NzListItemExtraComponent,
  NzListItemMetaComponent
} from "ng-zorro-antd/list";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {Task} from '../../../shared/interfaces/task.interface';
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {Router, RouterLink} from "@angular/router";
import {NzEmptyComponent} from "ng-zorro-antd/empty";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    JsonPipe,
    NzListComponent,
    NzRowDirective,
    NzColDirective,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzAvatarComponent,
    NzListItemExtraComponent,
    NzBadgeComponent,
    NzIconDirective,
    RouterLink,
    NzListEmptyComponent,
    NzEmptyComponent,
    NzButtonComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  loading: boolean = false;
  selectedTask!: Task;
  get tasks() {
    return this.taskService.tasks;
  }

  get user() {
    return this.authService.user;
  }
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    public router: Router,
  ) { }
  ngOnInit(): void {
    this.getTasks();
  }

  private getTasks() {
    this.taskService.getTasks(this.user.email)
      .subscribe((resp) => {
        this.loading = true;
        if (resp.status === 200) {
          this.loading = false;
        } else {
          console.log('Error getting tasks')
          this.loading = false;
        }
      })

  }

  taskClick(task: Task) {
    // console.log(task)
    this.router.navigate(['/main/tasks', task.task_id]);
    this.selectedTask = task;
  }
}
