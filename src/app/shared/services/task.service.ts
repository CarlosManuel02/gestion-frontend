import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Task, TaskResponse } from "../interfaces/task.interface";
import { catchError, map, Observable, tap, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = `${environment.ApiEndPoint}/api/tasks/`
  private _tasks: Task[] = [];
  get tasks(): Task[] {
    return [...this._tasks]
  }

  constructor(private http: HttpClient) {}

  getTasks(user: string | undefined): Observable<{ status: number }> {
    return this.http.get<TaskResponse>(`${this.API_URL}all/${user}`).pipe(
      tap((resp) => {
        if (resp.status === 200) {
          this._tasks = resp.tasks;
        } else {
          throw new Error('Error getting tasks');
        }
      }),
      map((resp) => ({ status: resp.status })),
      catchError((err: any) => {
        return throwError(() => new Error(err.message || 'Error getting tasks'));
      })
    );
  }
}
