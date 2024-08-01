import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ManagerService } from "../../../../shared/services/manager.service";
import { NzMessageService } from "ng-zorro-antd/message";
import {JsonPipe, NgForOf} from "@angular/common";
import {Permission, RoleSetting} from "../../../../shared/interfaces/permission.interface";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzIconDirective} from "ng-zorro-antd/icon";

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

  constructor(
    private projectsService: ManagerService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.projectsService.projectID;
    if (!id) {
      console.log('No project ID found');
      return;
    }

    this.projectsService.getProjectSettings(id)
      .then((resp: any) => {
        if (resp.status !== 200) {
          this.message.error(resp.message);
          return;
        } else {
          this.settings = resp.data;
        }
      });
  }



  createRoleSettingGroup(setting: RoleSetting): FormGroup {
    return this.fb.group({
      id: [setting.id],
      project_id: [setting.project_id],
      role_id: [setting.role_id],
      role_name: [setting.role_name],
      permissions: this.fb.array(setting.permissions.map(permission => this.createPermissionGroup(permission)))
    });
  }

  createPermissionGroup(permission: Permission): FormGroup {
    return this.fb.group({
      permission: [permission.permission],
      value: [permission.value]
    });
  }


  save() {
    if (this.settings.length > 0) {
      const updatedSettings = this.settings.map(setting => {
        return {
          id: setting.id,
          project_id: setting.project_id,
          role_id: setting.role_id,
          role_name: setting.role_name,
          permissions: setting.permissions.map(permission => {
            return {
              permission: permission.permission,
              value: permission.value
            };
          })
        };
      });
      this.projectsService.updateProjectSettings(updatedSettings)
        .then((resp: any) => {
          if (resp.status === 200) {
            this.message.success('Settings updated successfully');
          } else {
            this.message.error('Error updating settings');
          }
        })
        .catch(error => {
          this.message.error('An error occurred while updating settings');
        });
    } else {
      this.message.error('Please fill in the required fields');
    }
  }

  enableEdit(){
    this.canEdit = !this.canEdit;
  }
}
