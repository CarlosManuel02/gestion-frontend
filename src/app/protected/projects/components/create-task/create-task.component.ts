import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from "../../../../shared/services/task.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {ManagerService} from "../../../../shared/services/manager.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Member} from "../../../../shared/interfaces";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NgForOf} from "@angular/common";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzUploadChangeParam, NzUploadComponent, NzUploadFile} from "ng-zorro-antd/upload";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    FormsModule,
    NzFormDirective,
    ReactiveFormsModule,
    NzRowDirective,
    NzColDirective,
    NzFormControlComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzDividerComponent,
    NzSelectComponent,
    NzOptionComponent,
    NgForOf,
    NzDatePickerComponent,
    NzUploadComponent,
    NzIconDirective,
    NzButtonComponent,
    NzFlexDirective
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent implements OnInit {
  @Output() taskCreated = new EventEmitter();
  @Input() projectId!: string;
  taskForm = this.fb.group({
    task_key: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    deadline: [''],
    priority: ['', [Validators.required]],
    assignment: [''],
    project_id: ['']

  })

  projectMembers: Member[] = []

  loading: boolean = false;
  assignedTo!: string;
  // fileList: NzUploadFile[] = [];
  priorities = [
    {label: 'Low', value: 1},
    {label: 'Medium', value: 2},
    {label: 'High', value: 3},
    {label: 'Urgent', value: 4},
  ]
  constructor(
   public taskService: TaskService,
   public authService: AuthService,
   public managerService: ManagerService,
   public fb: FormBuilder,
   private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.getProjectMembers();
  }


  private getProjectMembers() {
    this.managerService.getProjecMembers(this.projectId).then((members: any) => {
      this.projectMembers = members;
    });
  }

  submitForm() {
    this.loading = true;
    const data = {
      ...this.taskForm.value,
      assignment: this.assignedTo,
      project_id: this.projectId
    }

    this.taskService.createTask(data).then((res: any) => {
      this.loading = false;
      if (res.status === 201) {
        this.taskCreated.emit(true);
      } else {
        this.taskCreated.emit(false);
        this.message.error('An error occurred while creating the task');
      }
    })

  }

  onAssignedToChange($event: any) {
    this.assignedTo = $event;
  }

  // handleChange($event: NzUploadChangeParam) {
  //   this.fileList = $event.fileList;
  //   console.log(this.fileList);
  // }
}
