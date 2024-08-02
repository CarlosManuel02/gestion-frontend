export interface Permission {
  value: boolean;
  permission: string;
}

export interface RoleSetting {
  id: string;
  project_id: string;
  role_id: string;
  role_name: string;
  permissions: Permission[];
}
