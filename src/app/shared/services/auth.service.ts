import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";
import {User} from "../interfaces/user.interface";
import {UserResponse} from "../../shared/interfaces/userResponse.interface";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endpoint = environment.ApiEndPoint + 'auth/';
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
            id: String(resp.user?.id),
            email: resp.user?.email,
            username: resp.user?.username,
            created_at: resp.user?.created_at,
          }
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
    this.router.navigateByUrl('/auth/login').then(() => {
      this.message.info('You have been logged out');
    })
    // localStorage.removeItem('token');
  }

  register(data: any) {
    const url = `${this.endpoint}new`;
    return this.http.post<UserResponse>(url, data)
      .pipe(
        tap((resp) => {
          this._user = {
            id: String(resp.user?.id),
            email: resp.user?.email,
            username: resp.user?.username,
            created_at: resp.user?.created_at
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
            id: String(resp.user?.id),
            email: resp.user?.email,
            username: resp.user?.username,
            created_at: resp.user?.created_at
          }
          localStorage.setItem('token', resp.token);
          console.log(resp);
          return resp.status == 200;
        }),
        catchError(() => of(false))
      )

  }

  isLogged() {
    return localStorage.getItem('token') !== null;
  }

  getUser(userId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
    return this.http.get(`${this.endpoint}${userId}`).pipe(
      tap((resp: any) => {
          if (resp.status === 200) {
            return {
              user: resp,
              status: resp.status,
            }
          } else {
            throw new Error(resp.message);
          }
        }
      ), map((resp: any) => {
        return {
          status: resp.status,
          user: resp.user
        }
      }),
      catchError((err: any) => {
        return of(err.message);
      })
    )
  }

  isLogin() {
    // retornar un observable que emita true o false dependiendo si el usuario esta en la pagina de login o registro o no
    return new Observable<boolean>(subscriber => {
      if (this.router.url === '/auth/login' || this.router.url === '/auth/register') {
        subscriber.next(false);
      } else {
        subscriber.next(true);
      }
    });
  }

  updateUser(data: any, userId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
    return this.http.patch(`${this.endpoint}update/${userId}`, data, {headers}).pipe(
      tap((resp: any) => {
        if (resp.status === 200) {
          return {
            user: resp,
            status: resp.status,
          }
        } else {
          throw new Error(resp.message);
        }
      }),
      map((resp: any) => {
        return {
          status: resp.status,
          user: resp.user
        }
      }),
      catchError((err: any) => {
        return of(err.message);
      })
    )
  }
}
