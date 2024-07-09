import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    NzDrawerModule,
    NzModalModule
  ],
  providers: [NzModalService],  // Add NzModalService here
})
export class ProjectsModule { }
