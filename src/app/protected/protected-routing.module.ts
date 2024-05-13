import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {TasksComponent} from "./pages/tasks/tasks.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'tasks', component: TasksComponent},
      {path: '**', redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
