import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzTypographyComponent} from "ng-zorro-antd/typography";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NgIf} from "@angular/common";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {Router, RouterLink} from "@angular/router";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NavbarComponent} from "../../../shared/components/navbar/navbar.component";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    NzTypographyComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzInputGroupComponent,
    NzFormControlComponent,
    NzInputDirective,
    ReactiveFormsModule,
    NzCheckboxComponent,
    NzButtonComponent,
    RouterLink,
    NzCardComponent,
    NzFormLabelComponent,
    NzIconDirective,
    NzColDirective,
    NzRowDirective,
    NavbarComponent,
    NgIf
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  validateForm!: FormGroup;
  passwordVisible = false;
  loading: boolean = false

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              public router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });
  }

  submitForm(): void {
    this.loading = true;
    const {username, email, password} = this.validateForm.value;
    if (username && email && password) {
      this.authService.register(username, email, password).subscribe((res) => {
        this.loading = false;
        if (res) {
          this.router.navigate(['/login']);
        }
      }, (error) => {
        this.loading = false;
      });
    }

  }

}
