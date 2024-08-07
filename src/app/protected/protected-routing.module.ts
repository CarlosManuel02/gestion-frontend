import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {TasksComponent} from "./pages/tasks/tasks.component";
import {ValidarTokenGuard} from "../shared/guards/validar-token.guard";
import {TaskViewComponent} from "./pages/task-view/task-view.component";
import {PorfileComponent} from "../shared/components/porfile/porfile.component";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ValidarTokenGuard],
    children: [
      {path: 'projects',  loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'tasks', component: TasksComponent},
      {path: 'tasks/:id', component: TaskViewComponent},
      {path: 'profile/:id', component: PorfileComponent},
      {path: '**', redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule {
}
