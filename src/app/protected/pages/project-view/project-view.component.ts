import {Component, OnInit} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent implements OnInit {
  project = ''

  constructor(
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    // get the id from the url
    console.log(this.router.url)
    this.project = this.router.url.split('/')[3]
  }

}
