import { Component } from '@angular/core';
import {NavbarComponent} from "../../../shared/components/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
