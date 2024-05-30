import {Member} from "./member.interface";

export interface Project {
  project_id:          string;
  project_name:        string;
  project_key:         string;
  project_owner_id:    string;
  project_owner_name:  string;
  project_owner_email: string;
  project_description: string;
  project_start_date:  Date;
  project_end_date:    Date;
  project_status:      string;
  project_image_url:   string;
  project_repository:  string;
  members:             Member[];
}

