import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from "../../../../shared/services/task.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {ManagerService} from "../../../../shared/services/manager.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
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

  // task_key: string;
  // name: string;
  // description?: string;
  // status: string;
  // creation_date: string;
  // deadline?: string;
  // priority: number;
  // assignment?: string;
  // project_id?: string;
  taskForm = this.fb.group({
    task_key: [''],
    name: [''],
    description: [''],
    status: [''],
    creation_date: [''],
    deadline: [''],
    priority: [''],
    assignment: [''],
    project_id: ['']

  })

  projectMembers: Member[] = []
  statuses = [
    {label: 'Open', value: 'open'},
    {label: 'In Progress', value: 'in_progress'},
    {label: 'Completed', value: 'completed'},
    {label: 'Closed', value: 'closed'},
  ]
  loading: boolean = false;
  assignedTo!: string;
  fileList: NzUploadFile[] = [];
  constructor(
   public taskService: TaskService,
   public authService: AuthService,
   public managerService: ManagerService,
   public fb: FormBuilder
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

  }

  onAssignedToChange($event: any) {
    this.assignedTo = $event;
  }

  handleChange($event: NzUploadChangeParam) {
    this.fileList = $event.fileList;
    console.log(this.fileList);
  }
}
