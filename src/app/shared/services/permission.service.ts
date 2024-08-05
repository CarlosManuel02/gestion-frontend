import { Injectable } from '@angular/core';
import {ManagerService} from "./manager.service";
import {AuthService} from "./auth.service";
import {RoleSetting} from "../interfaces/permission.interface";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private managerService: ManagerService,
    private authService: AuthService
  ) {}


  checkPermission(role: string, value:string, settings: RoleSetting[], callback: (hasPermission: boolean) => void) {
    let hasPermission = true;
    settings.forEach((setting: RoleSetting) => {
      if (setting.role_name.toLowerCase() === role) {
        setting.permissions.forEach((permission: any) => {
          if (permission.permission === value) {
            hasPermission = permission.value;
          }
        });
      }
    });
    callback(hasPermission);
  }
}
