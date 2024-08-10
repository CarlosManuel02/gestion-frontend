import { Injectable } from '@angular/core';
import { ManagerService } from "./manager.service";
import { AuthService } from "./auth.service";
import { RoleSetting, Permission } from "../interfaces/permission.interface";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private managerService: ManagerService,
    private authService: AuthService
  ) {}

  checkPermission(role: string, value: string, settings: RoleSetting[], callback: (hasPermission: boolean) => void) {
    let hasPermission = false; // Por defecto a `false`, cambiará a `true` si encuentra un permiso válido.

    const roleSetting = settings.find(setting => setting.role_name.toLowerCase() === role.toLowerCase());

    if (roleSetting) {
      hasPermission = roleSetting.permissions.some((permission: Permission) =>
        permission.permission === value && permission.value
      );
    }

    callback(hasPermission);
  }
}
