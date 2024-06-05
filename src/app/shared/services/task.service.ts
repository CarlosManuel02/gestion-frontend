import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Task, TaskResponse} from "../interfaces/task.interface";
import {catchError, map, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = `${environment.ApiEndPoint}tasks/`
  private _tasks: Task[] = [];
  private _task: Task = {} as Task;

  get task(): Task {
    return {...this._task}
  }

  get tasks(): Task[] {
    return [...this._tasks]
  }

  constructor(private http: HttpClient) {
  }

  async getTasksFromUser(user: string | undefined): Promise<{ status: number, tasks: Task[] }> {
    return new Promise((resolve, reject) => {
        this.http.get<TaskResponse>(`${this.API_URL}all/user/${user}`).subscribe((resp) => {
          if (resp.status === 200) {
            this._tasks = resp.tasks;
            resolve({status: resp.status, tasks: resp.tasks});
          } else {
            reject({status: resp.status, tasks: []});
          }
        })
      }
    );
  }

  async getTasksFromProject(project: string | undefined): Promise<{ status: number, tasks: Task[] }> {
    return new Promise((resolve, reject) => {
      this.http.get<TaskResponse>(`${this.API_URL}all/${project}`).subscribe((resp) => {
        if (resp.status === 200) {
          this._tasks = resp.tasks;
          resolve({status: resp.status, tasks: resp.tasks});
        } else {
          reject({status: resp.status, tasks: []});
        }
      })
    });
  }

  getTask(taskId: string): Observable<{ status: number }> {
    return this.http.get(`${this.API_URL}${taskId}`).pipe(
      tap((resp: any) => {
        if (resp.status === 200) {
          this._task = resp.task[0];
        } else {
          throw new Error('Error getting task');
        }
      }),
      map((resp) => ({status: resp.status})),
      catchError((err: any) => {
        return throwError(() => new Error(err.message || 'Error getting task'));
      })
    );
  }

  getAttachments(taskId: string): Promise<{ status: number }> {
    return new Promise((resolve, reject) => {
      this.http.get(`http://localhost:8080/api/attachments/${taskId}`)
        .subscribe((resp: any) => {
          if (resp.status === 200) {
            this._task.attachments = resp.attachments;
            resolve({status: resp.status});
          } else {
            reject({status: resp.status});
          }
        });
    })
  }

  uploadAttachment(file: File, task_id: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('task_id', task_id);

    return new Promise((resolve, reject) => {
      this.http.post(`http://localhost:8080/api/attachments`, formData)
        .subscribe((resp: any) => {
          if (resp.status === 200) {
            resolve({status: resp.status});
          } else {
            reject({status: resp.status});
          }
        });
    });

  }

  updateTask(taskId: string, data: any): Promise<{ status: number }> {

    return new Promise((resolve, reject) => {
      this.http.patch(`http://localhost:8080/api/tasks/${taskId}`, data)
        .subscribe((resp: any) => {
          if (resp.status === 200) {
            resolve({status: resp.status});
          } else {
            reject({status: resp.status});
          }
        });
    })

  }
}
