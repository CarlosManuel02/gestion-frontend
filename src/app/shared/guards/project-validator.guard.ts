import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {ManagerService} from "../services/manager.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Observable, tap} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ProjectValidatorGuard {
  constructor(
    private authService: AuthService,
    private managerService: ManagerService,
    private router: Router,
    private message: NzMessageService,

  ) {
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const projectId = this.managerService.project.project_id;
    const user = this.authService.user.id;
    // console.log('ProjectValidatorGuard', projectId, user);

    return this.managerService.checkMember({
      project_id: projectId,
      id: user,
    }).pipe(
      tap((valid) => {
        if (!valid) {
          this.router.navigateByUrl('/dashboard');
          this.message.error('No tienes permisos para acceder a este proyecto.');
        }
      }
    ));
  }

  }
