import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import {IconModule} from "@ant-design/icons-angular";
import {NzModalModule} from "ng-zorro-antd/modal";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    IconModule,
    NzModalModule
  ]
})
export class ProtectedModule { }
