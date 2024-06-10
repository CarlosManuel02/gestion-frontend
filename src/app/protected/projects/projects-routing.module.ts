import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectViewComponent} from "./pages/project-view/project-view.component";
import {MainComponent} from "./pages/main/main.component";
import {ProjectsComponent} from "./pages/projects/projects.component";
import {TasksBoardComponent} from "../pages/tasks-board/tasks-board.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', component: ProjectsComponent},
      {
        path: ':id',
        component: ProjectViewComponent,
        children: [
          {path: '', redirectTo: 'board', pathMatch: 'full'},
          {path: 'board', component: TasksBoardComponent},
          // {path: 'members', component: MembersComponent},
        ]
      },
      {path: '**', redirectTo: 'projects'}
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
