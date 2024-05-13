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
import {RouterLink} from "@angular/router";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NavbarComponent} from "../../../shared/components/navbar/navbar.component";

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, email, password } = this.validateForm.value;
      // Aquí puedes utilizar los datos del formulario para realizar el registro
      console.log('Datos del registro:', { userName, email, password });
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
