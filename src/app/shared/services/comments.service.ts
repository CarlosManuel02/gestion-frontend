import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Comments} from "../interfaces/comment.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {


  private readonly API_URL = `${environment.ApiEndPoint}comments`;

  private _comments: Comments[] = [];

  get comments(): Comments[] {
    return [...this._comments]
  }

  set comments(value: Comments[]) {
    this._comments = value;
  }


  constructor(
    public http: HttpClient
  ) { }

  getComments(id: string) {

    return new Promise((resolve, reject) => {
      this.http.get(`${this.API_URL}/all/${id}`).subscribe((data: any) => {
        this._comments = data;
        resolve(data);
      }, error => {
        reject(error);
      });
    })

  }

  addComment(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.API_URL}/new`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    })

  }

  deleteComment(id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.API_URL}/delete/${id}`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    })
  }
}
