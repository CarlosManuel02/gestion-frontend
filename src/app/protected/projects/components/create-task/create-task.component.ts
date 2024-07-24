import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from "../../../../shared/services/task.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {ManagerService} from "../../../../shared/services/manager.service";
import {FormBuilder} from "@angular/forms";
import {Member} from "../../../../shared/interfaces";

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent implements OnInit {
  @Output() taskCreated = new EventEmitter();
  @Input() projectId!: string;

  taskForm = this.fb.group({

  })

  members: Member[] = [];

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
      this.members = members;
    });
  }
}
