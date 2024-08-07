import {Component, OnInit} from '@angular/core';
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
import {NzMessageService} from "ng-zorro-antd/message";

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
export class RegistroComponent implements OnInit {

  validateForm!: FormGroup;
  passwordVisible = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              public router: Router,
              public message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatch: true };
  }


  submitForm(): void {
    this.loading = true;
    const data = {
      "username": this.validateForm.value.username,
      "email": this.validateForm.value.email,
      "password": this.validateForm.value.password
    }

    this.authService.register(data).subscribe((res) => {
      this.loading = false;
      if (res) {
        this.router.navigate(['/login']);
        this.message.success('User registered successfully');
      }
    }, (error) => {
      this.loading = false;
      this.message.error(error.error.message);
    });


  }

}
