import {Component, Input, OnInit} from '@angular/core';
import {ManagerService} from '../../../../shared/services/manager.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoleSetting} from '../../../../shared/interfaces/permission.interface';
import {Member, Project} from '../../../../shared/interfaces';
import {AuthService} from '../../../../shared/services/auth.service';
import {PermissionService} from '../../../../shared/services/permission.service';
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from 'ng-zorro-antd/descriptions';
import {NzBadgeComponent} from 'ng-zorro-antd/badge';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalService} from 'ng-zorro-antd/modal';
import {NzInputDirective, NzTextareaCountComponent} from "ng-zorro-antd/input";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    NzBadgeComponent,
    DatePipe,
    NgIf,
    NzButtonComponent,
    FormsModule,
    NzModalComponent,
    NzInputDirective,
    NzModalContentDirective,
    NgForOf,
    NzColDirective,
    NzDatePickerComponent,
    NzDividerComponent,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzRadioComponent,
    NzRadioGroupComponent,
    NzRowDirective,
    NzTableComponent,
    NzThMeasureDirective,
    ReactiveFormsModule,
    NzModalFooterDirective,
    NzTextareaCountComponent,
    NzSelectComponent,
    NzOptionComponent
  ],
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.less'
})
export class ProjectInfoComponent implements OnInit {
  @Input() projectId!: string;
  loading = false;
  canEdit: boolean = true;
  showEditModal = false;
  private settings: RoleSetting[] = [];
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.minLength(5), Validators.maxLength(1000)]],
    status: [''],
    project_key: ['', [Validators.required, Validators.minLength(3)]],
    repository_url: [''],
    start_date: [''],
    end_date: [''],
  })

  constructor(
    private projectService: ManagerService,
    public message: NzMessageService,
    private authService: AuthService,
    private permission: PermissionService,
    private modal: NzModalService,
    private fb: FormBuilder,
  ) {
  }

  get project() {
    return this.projectService.project;
  }

  ngOnInit(): void {
    this.getProjectInfo();
    this.getSettings();
    this.getCurrentUser();

  }


  private getProjectInfo() {
    this.loading = true;
    this.projectService.getProject(this.projectId).then((resp: any) => {
      this.loading = false;
      if (resp.status !== 200) {
        this.message.error('Error al obtener la información del proyecto');
        return;
      }
      this.updateFormWithProjectData();
    }).catch((err: any) => {
      console.log(err);
    });
  }

  private updateFormWithProjectData() {
    this.form.patchValue({
      name: this.project.project_name,
      description: this.project.project_description,
      status: this.project.project_status,
      project_key: this.project.project_key,
      repository_url: this.project.project_repository,
      start_date: this.project.project_start_date,
      end_date: this.project.project_end_date,
    })
  }

  private getSettings() {
    this.projectService.getProjectSettings(this.projectId)
      .then((resp: any) => {
        if (resp.status !== 200) {
          this.message.error(resp.message);
          return;
        } else {
          this.settings = resp.data.map((setting: any) => {
            return {
              ...setting,
              permissions: [
                { permission: 'read', value: setting.permissions.read },
                { permission: 'create', value: setting.permissions.create },
                { permission: 'delete', value: setting.permissions.delete },
                { permission: 'update', value: setting.permissions.update }
              ],
              dirty: false
            };
          });
        }
      }, error => {
        this.message.error('An error occurred while fetching settings');
        console.error(error);
      });
  }


  async getCurrentUser() {
    await this.projectService.getProjecMembers(this.projectId).then((resp: any) => {
      resp.forEach((member: Member) => {
        if (member.member_id === this.authService.user.id) {
          this.permission.checkPermission(member.member_role, 'update', this.settings, (hasPermission: boolean) => {
            this.canEdit = !hasPermission;
          });
        }
      });
    });
  }

  editProject() {
    this.showEditModal = true;
  }

  saveProject() {

    if (this.form.invalid) {
      this.message.error('Please fill all required fields');
      return;
    }
    const data = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      start_date: this.form.get('start_date')?.value,
      end_date: this.form.get('end_date')?.value,
      project_key: this.form.get('project_key')?.value,
      repository_url: this.form.get('repository_url')?.value,

    }

    this.projectService.updateProject(this.projectId, data).then((resp: any) => {
      if (resp.status === 200) {
        this.message.success('Project updated successfully');
        this.getProjectInfo();
        this.showEditModal = false;
      } else {
        this.message.error('Error updating project');
      }
    }).catch((err: any) => {
      console.log(err);
      this.message.error('Error updating project');
    });
  }

  handleCancel(): void {
    this.showEditModal = false;
  }
}
