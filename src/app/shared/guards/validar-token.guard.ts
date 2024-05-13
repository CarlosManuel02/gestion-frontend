import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate {
  constructor(private authService: AuthService,
              private message: NzMessageService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.renewToken()
      .pipe(
        tap(valid => {
          if (!valid) {
            this.router.navigateByUrl('/auth');
            this.message.error('Sesión expirada, por favor vuelva a iniciar sesión.');
          }
        })
      );


  }

}
