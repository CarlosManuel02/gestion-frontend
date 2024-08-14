import {Component, OnInit} from '@angular/core';
import {ManagerService} from "../../../../shared/services/manager.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../shared/services/auth.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NumberCardModule} from "@swimlane/ngx-charts";
import {single} from "./data";

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [
    NumberCardModule
  ],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.less'
})
export class GraphsComponent implements OnInit {

  projectId = '';
  single!: any[];
  view: [number,number] = [700, 400];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';

  constructor(
    private projectsService: ManagerService,
    public router: Router,
    private authService: AuthService,
    public message: NzMessageService,
  ) {
    Object.assign(this, {single});

  }

  ngOnInit(): void {
    this.projectId = this.projectsService.projectID || this.router.url.split('/')[3];

  }

  onSelect(event: any) {
    console.log(event);
  }


}
