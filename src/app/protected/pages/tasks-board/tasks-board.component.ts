import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Router} from "@angular/router";
import {TaskService} from "../../../shared/services/task.service";
import {
  CdkDragDrop,
  CdkDropList,
  transferArrayItem,
  moveItemInArray,
  CdkDrag,
  CdkDragHandle
} from "@angular/cdk/drag-drop";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {NzListComponent} from "ng-zorro-antd/list";
import {DatePipe, NgIf, NgStyle} from "@angular/common";
import {Task} from "../../../shared/interfaces/task.interface";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {UserDisplayComponent} from "../../components/user-display/user-display.component";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective} from "ng-zorro-antd/modal";
import {CreateTaskComponent} from "../../projects/components/create-task/create-task.component";
import {TaskViewComponent} from "../task-view/task-view.component";
import {PriorityTagComponent} from "../../../shared/components/priority-tag/priority-tag.component";
import {ManagerService} from "../../../shared/services/manager.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {RoleSetting} from "../../../shared/interfaces/permission.interface";
import {AuthService} from "../../../shared/services/auth.service";
import {Member} from "../../../shared/interfaces";
import {PermissionService} from "../../../shared/services/permission.service";

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  templateUrl: './tasks-board.component.html',
  imports: [
    NzColDirective,
    CdkVirtualScrollViewport,
    NzListComponent,
    CdkDropList,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkDrag,
    NzRowDirective,
    NgStyle,
    NgIf,
    NzDividerComponent,
    NzCardComponent,
    NzCardMetaComponent,
    NzTagComponent,
    UserDisplayComponent,
    NzBadgeComponent,
    DatePipe,
    NzTooltipDirective,
    NzButtonComponent,
    NzModalComponent,
    CreateTaskComponent,
    NzModalContentDirective,
    NzModalFooterDirective,
    TaskViewComponent,
    PriorityTagComponent,
    CdkDragHandle
  ],
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent implements OnInit, AfterViewInit {

  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  projectId: string = '';
  connectedTo: string[] = [];
  done: Task[] = [];
  inProgress: Task[] = [];
  open: Task[] = [];
  isModalVisible: boolean = false;
  isTaskDetailsVisible: boolean = false;
  taskId: string = '';
  settings: RoleSetting[] = [];
  canCreate: boolean = false;

  get tasks() {
    return this.taskService.tasks;
  }

  constructor(
    public router: Router,
    private taskService: TaskService,
    private authService: AuthService,
    private projectsService: ManagerService,
    public message: NzMessageService,
    public permission: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.projectId = this.projectsService.projectID || this.router.url.split('/')[3];
    this.fetchTasks();
    this.getSettings();
  }

  ngAfterViewInit() {
    this.connectedTo = this.dropLists.map(dropList => dropList.id);
  }

  private fetchTasks() {
    this.taskService.getTasksFromProject(this.projectId).then((resp: any) => {
      this.populateTasks();
    }).catch((err: any) => {
      console.log(err);
    });
  }

  changeStatus(event: CdkDragDrop<any>) {
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;

    if (!previousContainer || !currentContainer) {
      console.error('One of the containers is undefined');
      return;
    }

    if (previousContainer === currentContainer) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        previousContainer.data,
        currentContainer.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const task = currentContainer.data[event.currentIndex];
    if (currentContainer === this.dropLists.toArray()[0]) {
      task.task_status = 'open';
    } else if (currentContainer === this.dropLists.toArray()[1]) {
      task.task_status = 'in_progress';
    } else if (currentContainer === this.dropLists.toArray()[2]) {
      task.task_status = 'completed';
    }

    this.taskService.updateTask(task.task_id, task).then(() => {
    }).catch((err: any) => {
      console.log('Error updating task status', err);
      this.message.error('Error updating task status');
    });
  }

  populateTasks() {
    this.open = [];
    this.inProgress = [];
    this.done = [];
    this.tasks.forEach((task: Task) => {
      if (task.task_status === 'open') {
        this.open.push(task);
      } else if (task.task_status === 'in_progress') {
        this.inProgress.push(task);
      } else if (task.task_status === 'completed') {
        this.done.push(task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const task = event.container.data[event.currentIndex];
      this.updateTaskStatus(task);
    }
  }

  private updateTaskStatus(task: Task) {
    if (this.open.includes(task)) {
      task.task_status = 'open';
    } else if (this.inProgress.includes(task)) {
      task.task_status = 'in_progress';
    } else if (this.done.includes(task)) {
      task.task_status = 'completed';
    }

    const data = {
      status: task.task_status,
    }

    this.taskService.updateTask(task.task_id, data).then((resp: any) => {
    }).catch((err: any) => {
      console.log('Error updating task status', err);
    });
  }

  openTaskDetails(item: Task) {
    this.taskId = item.task_id;
    this.isTaskDetailsVisible = true;
  }

  openCreateTaskModal() {
    if (this.canCreate) {
      this.isModalVisible = true;
    } else {
      this.message.error("No tienes permisos para crear tareas.");
    }
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  handleTaskCreated($event: any) {
    if ($event) {
      this.fetchTasks();
    }
    this.isModalVisible = false;
  }

  handleTaskDetailsCancel() {
    this.isTaskDetailsVisible = false;
  }

  private getSettings() {
    this.projectsService.getProjectSettings(this.projectId)
      .then((resp: any) => {
        if (resp.status !== 200) {
          this.message.error(resp.message);
          return;
        } else {
          this.settings = resp.data;
          this.getCurrentUser();
        }
      });
  }

  async getCurrentUser() {
    const user: any = await this.projectsService.getProjecMembers(this.projectId).then(
      (resp: any) => {
        resp.forEach((member: Member) => {
          if (member.member_id === this.authService.user.id) {
            this.permission.checkPermission(member.member_role, 'update', this.settings, (hasPermission: boolean) => {
              this.canCreate = hasPermission;
            });
          }
        });
      }
    );
  }

}
