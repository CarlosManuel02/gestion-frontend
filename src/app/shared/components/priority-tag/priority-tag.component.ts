import {Component, Input} from '@angular/core';
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-priority-tag',
  standalone: true,
  imports: [
    NzTagComponent,
    NgIf
  ],
  template: `
    <nz-tag *ngIf="priority === 1" nzColor="green">Low</nz-tag>
    <nz-tag *ngIf="priority === 2" nzColor="orange">Medium</nz-tag>
    <nz-tag *ngIf="priority === 3" nzColor="red">High</nz-tag>
    <nz-tag *ngIf="priority === 4" nzColor="purple">Urgent</nz-tag>
  `,
  styles: [``]
})
export class PriorityTagComponent {
  @Input() priority!: number | string | undefined;


}
