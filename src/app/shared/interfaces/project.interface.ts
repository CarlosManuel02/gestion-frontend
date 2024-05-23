export interface Project {
  project_id:          string;
  project_name:        string;
  project_owner:       string;
  project_description: string;
  project_start_date:  Date;
  project_end_date:    Date;
  project_status:      string;
  project_image_url:   string;
  members:             Member[];
}

export interface Member {
  member_id:       null;
  member_role:     null;
  member_email:    null;
  member_username: null;
}
