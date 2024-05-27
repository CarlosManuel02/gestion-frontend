export interface Files {
  id:         string;
  task_id:    string;
  file_name:  string;
  data:       Data;
  mime_type:  string;
  created_at: Date;
  size:       number;
}

export interface Data {
  type: string;
  data: number[];
}
