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

  @Input() tasks: Task[] = [];
  @Input() loading!: boolean;
  @Input() filter!: string;

  filterTask: Task[] = [];

  @Output() onTaskClick: EventEmitter<Task> = new EventEmitter<Task>();

  constructor() {
  }

  ngOnInit() {
    console.log('tasks', this.tasks)
    console.log('filter', this.filter)
    if (this.filter) {
      this.filterTask = this.tasks.filter(task => task.task_status === this.filter);
    } else {
      this.filterTask = this.tasks;
    }
  }
  taskClick(task: Task) {
    this.onTaskClick.emit(task);
  }

}
