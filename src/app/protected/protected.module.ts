import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import {IconModule} from "@ant-design/icons-angular";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ProjectsModule} from "./projects/projects.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    IconModule,
    NzModalModule,
    ProjectsModule,
  ]
})
export class ProtectedModule { }
