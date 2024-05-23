import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {TaskService} from "../../../shared/services/task.service";
import {JsonPipe} from "@angular/common";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  NzListComponent,
  NzListItemComponent,
  NzListItemExtraComponent,
  NzListItemMetaComponent
} from "ng-zorro-antd/list";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import { Task } from '../../../shared/interfaces/task.interface';

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
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  loading: boolean = false;
  get tasks() {
    return this.taskService.tasks;
  }
  get user() {
    return this.authService.user;
  }
  constructor(
    private taskService: TaskService,
    private authService: AuthService
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
    console.log(task)
  }
}
