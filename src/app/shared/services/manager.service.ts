import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Project} from "../interfaces/project.interface";
import {AuthService} from "./auth.service";
import {Member} from "../interfaces";
import {catchError, map, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private readonly API_URL = `${environment.ApiEndPoint}projects/`

  private _projects: Project[] = [];
  get projects() {
    return [...this._projects]
  }

  private _project: Project = {} as Project;
  get project() {
    return {...this._project}
  }

  constructor(private http: HttpClient,private authService: AuthService) { }


  getProject(projectId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.API_URL}${projectId}`).subscribe((resp: any) => {
        if (resp.status !== 200) {
          reject({message: resp.message})
        } else {
          this._project = resp.data[0]
          resolve(resp.status)
        }
      })
    });
  }

  getProjects() {
    return this.http.get<Project[]>(`${this.API_URL}all/${this.authService.user.id}`)
      .subscribe((projects: Project[]) => {
        this._projects = projects;
      });
  }

  getProjecMembers(projectId: string): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.API_URL}members/${projectId}`).subscribe((resp: any) => {
        if (resp.status !== 200) {
          reject(resp)
        } else {
          resolve(resp.data)
        }
      })
    });
  }

  createProject(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.API_URL}create`, data).subscribe((resp: any) => {
        if (resp.status !== 200) {
          reject(resp)
        } else {
          resolve(resp)
        }
      })
    });
  }

  upodatemember(member: Member) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.API_URL}updateMember`, member).subscribe((resp: any) => {
        if (resp.status !== 200) {
          reject(resp)
        } else {
          resolve(resp)
        }
      })
    });
  }

  checkMember(param: { project_id: string; id: string }) {
      return this.http.post(`${this.API_URL}members/check/`, param).pipe(
        map((resp: any) => {
          console.log(resp)
          return resp.status == 200;
        }
      ), catchError((err: any) => of(false)));

  }

  removeMember(data: { project_id: string; id: string }) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.API_URL}removeMember`, data).subscribe((resp: any) => {
        if (resp.status !== 200) {
          reject(resp)
        } else {
          resolve(resp.status)
        }
      })
    });
  }
}
