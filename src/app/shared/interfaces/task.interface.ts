export interface TaskResponse {
  tasks:  Task[];
  status: number;
}

export interface Task {
  task_id:            string;
  task_name:          string;
  task_description:   string;
  task_status:        string;
  task_creation_date: Date;
  task_deadline:      Date;
  task_priority:      number;
  task_assignment:    string;
  project_id:         string;
  project_name:       string;
}
