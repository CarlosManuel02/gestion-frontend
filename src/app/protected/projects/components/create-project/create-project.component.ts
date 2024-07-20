import {Component, OnInit} from '@angular/core';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NgForOf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzModalComponent, NzModalContentDirective, NzModalService} from "ng-zorro-antd/modal";
import {SearchMemberComponent} from "../../../../shared/component/search-member/search-member.component";
import {AuthService} from "../../../../shared/services/auth.service";
import {ManagerService} from "../../../../shared/services/manager.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    NzFormDirective,
    NzFormItemComponent,
    NzFormControlComponent,
    ReactiveFormsModule,
    NzInputDirective,
    NzColDirective,
    NzFormLabelComponent,
    NzRowDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzDatePickerComponent,
    NgForOf,
    NzButtonComponent,
    NzDividerComponent,
    NzInputGroupComponent,
    NzIconDirective,
    NzTableComponent,
    NzThMeasureDirective,
    NzModalComponent,
    SearchMemberComponent,
    NzModalContentDirective,
    NzSwitchComponent,
    NzRadioGroupComponent,
    NzRadioComponent,
    FormsModule
  ],
  providers: [NzModalService],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {


  form!: FormGroup
  members: any[] = []
  get user() {
    return this.authService.user
  }
  isVisible: boolean = false;
  projectVisibility: any;


  ngOnInit() {
    // name:
    // description:
    // status:
    // project_key:
    // repository_url:
    //   members:[{"id":"61e4e6d9-3368-4c06-95eb-f029415dcd61","role":"admin"}]↵
// owner:

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      project_key: ['', [Validators.required, Validators.minLength(3)]],
      repository_url: [''],
      end_date: [''],
    })

  }


  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public managerService: ManagerService,
    public message: NzMessageService
  ) {
  }

  submitForm() {
    const data = {
      ...this.form.value,
      owner: this.user.id,
      end_date: this.form.value.end_date ? this.form.value.end_date.toISOString() : null,
    }
    data["visibility"] = this.projectVisibility !== 'private';
    if (this.members.length > 0) {
      data.members = JSON.stringify(
        this.members.map((member: any) => {
          return {
            id: member.id,
            role: 'admin'
          }
        })
      )
    }


    console.log(data)
    // this.managerService.createProject(data)
    //   .then((resp: any) => {
    //     console.log(resp)
    //   })


  }

  openModal() {
    this.isVisible = true;

  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

  getSelectedMembers($event: any) {
    // console.log($event)
    this.members = $event
  }
}
