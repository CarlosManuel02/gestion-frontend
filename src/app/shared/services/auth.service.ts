import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";
import {User} from "../interfaces/user.interface";
import {UserResponse} from "../../shared/interfaces/userResponse.interface";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endpoint = 'http://localhost:8080/api/auth/';
  private _user!: User;

  constructor(private http: HttpClient,
              private message: NzMessageService,
              public router: Router
  ) {
  }

  get user() {
    return this._user;
  }

  login(email: string, password: string): Observable<{ status: number, message: string }> {
    const url = `${this.endpoint}login`;
    const body = {email, password};

    return this.http.post<UserResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.message === "Incorrect email or password") {
          throw new Error("Incorrect email or password");
        } else {
          this._user = {
            image: resp.user?.image,
            id: resp.user?.id,
            email: resp.user?.email,
            username: resp.user?.username
          }
          console.log(this._user)
          localStorage.setItem('token', resp.token);
          return {status: resp.status, message: resp.message}
        }

      }),
      map((resp) => ({status: resp.status, message: 'Login successful'})),
      catchError((err: any) => {
        return of({status: 400, message: err.message});
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  register(username: string, email: string, password: string) {
    const url = `${this.endpoint}new`;
    const body = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post<UserResponse>(url, body)
      .pipe(
        tap((resp) => {
          this._user = {
            id: resp.user?.id,
            email: resp.user?.email,
            username: resp.user?.username,
            image: resp.user?.image
          }
          localStorage.setItem('token', resp.token);
        }),
        map((resp: any) => resp.status == 200),
        catchError((err: any) => of(err.error.message))
      )
  }


  renewToken() {
    const url = `${this.endpoint}renew`;
    let headers = new HttpHeaders();
    headers = headers.set('token', localStorage.getItem('token') || '');
    return this.http.post<UserResponse>(url, null, {headers})
      .pipe(
        map((resp) => {
          this._user = {
            id: resp.user?.id,
            email: resp.user?.email,
            username: resp.user?.username,
            image: resp.user?.image
          }
          console.log(this._user)
          localStorage.setItem('token', resp.token);
          return resp.status == 200;
        }),
        catchError(() => of(false))
      )

  }

  isLogged() {
    return localStorage.getItem('token') !== null;
  }

  getUser() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
    return new Promise((resolve, reject) => {
      this.http.get<UserResponse>(`${this.endpoint}user`, {headers})
        .subscribe((resp) => {
          if (resp) {
            resolve(resp)
          } else {
            reject('Error getting user')
          }
        })
    });
  }

}