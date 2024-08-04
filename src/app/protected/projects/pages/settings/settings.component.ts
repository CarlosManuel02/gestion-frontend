import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ManagerService} from "../../../../shared/services/manager.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {JsonPipe, NgForOf} from "@angular/common";
import {Permission, RoleSetting} from "../../../../shared/interfaces/permission.interface";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {Router} from "@angular/router";
import {Member} from "../../../../shared/interfaces";
import {AuthService} from "../../../../shared/services/auth.service";
import {PermissionService} from "../../../../shared/services/permission.service";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NzSwitchComponent,
    NzInputDirective,
    NzButtonComponent,
    NzThMeasureDirective,
    NzTableComponent,
    NzIconDirective,
    NgForOf,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  settings: RoleSetting[] = [];
  canEdit: boolean = true
  id!: string;
  hasPermission: boolean = true;

  constructor(
    private projectsService: ManagerService,
    private message: NzMessageService,
    private fb: FormBuilder,
    public router: Router,
    public authService: AuthService,
    public permission: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.id = this.projectsService.projectID || this.router.url.split('/')[3];
    if (!this.id) {
      console.log('No project ID found');
      return;
    }
    this.getSettings();
    this.getCurrentUser();
    }


  createRoleSettingGroup(setting: RoleSetting): FormGroup {
    return this.fb.group({
      id: [setting.id],
      project_id: [setting.project_id],
      role_id: [setting.role_id],
      role_name: [setting.role_name],
      permissions: this.fb.array(setting.permissions.map(permission => this.createPermissionGroup(permission))),
      dirty: [false] // Initialize the dirty flag
    });
  }


  createPermissionGroup(permission: Permission): FormGroup {
    return this.fb.group({
      permission: [permission.permission],
      value: [permission.value]
    });
  }


  save() {
    const modifiedSettings = this.settings.filter(setting => setting.dirty);

    if (modifiedSettings.length > 0) {
      modifiedSettings.forEach(setting => {
        const updatedSetting = {
          id: setting.id,
          project_id: setting.project_id.toString(), // Ensure this is a string
          role_id: setting.role_id.toString(), // Ensure this is a string
          permissions: setting.permissions.map(permission => {
            return {
              permission: permission.permission,
              value: permission.value
            };
          })
        };

        console.log('updatedSetting', updatedSetting);
        this.projectsService.updateProjectSettings(this.id, updatedSetting)
          .then((resp: any) => {
            this.canEdit = true;

            if (resp.status === 200) {
              this.message.success('Settings updated successfully');
              setting.dirty = false; // Reset the dirty flag after successful update
            } else {
              this.message.error('Error updating settings');
            }
          })
          .catch(error => {
            this.message.error('An error occurred while updating settings');
            console.log(error);
          });
      });
    } else {
      this.message.error('No changes to save');
    }
  }


  enableEdit() {
    this.canEdit = !this.canEdit;
  }

  disableEdit() {
    this.canEdit = !this.canEdit;
  }

  private getSettings() {
    this.projectsService.getProjectSettings(this.id)
      .then((resp: any) => {
        console.log('resp', resp);
        if (resp.status !== 200) {
          this.message.error(resp.message);
          return;
        } else {
          this.settings = resp.data.map((setting: RoleSetting) => {
            return {
              ...setting,
              dirty: false
            };
          });
        }
      }, error => {
        this.message.error('An error occurred while fetching settings');
        console.log(error);
      });
  }

  async getCurrentUser() {
    const user: any = await this.projectsService.getProjecMembers(this.id).then(
      (resp: any) => {
        resp.forEach((member: Member) => {
          if (member.member_id === this.authService.user.id) {
            this.permission.checkPermission(member.member_role, 'update', this.settings, (hasPermission: boolean) => {
              this.hasPermission = hasPermission;
            });
          }
        });
      }
    );
  }


}
