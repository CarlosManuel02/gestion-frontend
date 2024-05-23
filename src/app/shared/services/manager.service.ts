import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {Project} from "../interfaces/project.interface";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private readonly API_URL = `${environment.ApiEndPoint}/api/projects/`

  private _projects: Project[] = [];
  get projects() {
    return [...this._projects]
  }
  constructor(private http: HttpClient,private authService: AuthService) { }

  getProjects() {
    return this.http.get<Project[]>(`${this.API_URL}all/${this.authService.user.id}`)
      .subscribe((projects: Project[]) => {
        this._projects = projects;
      });
  }
}
