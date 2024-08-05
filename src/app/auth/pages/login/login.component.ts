import {Component, OnInit} from '@angular/core';
import {NzTypographyComponent} from "ng-zorro-antd/typography";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NavbarComponent} from "../../../shared/components/navbar/navbar.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-login',
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
    NgIf,
    FormsModule,

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


  validateForm!: FormGroup;
  passwordVisible = false;
  loading: boolean = false;
  remember: boolean = false;

  login() {

    console.log(this.remember)

    if (!this.remember) {
      localStorage.setItem('email', this.validateForm.value.email);
    }

    console.log(this.validateForm.value)
    this.loading = true;
    const {email, password} = this.validateForm.value;
    console.log(email, password)
    if (email != null && password != null) {
      this.authservice.login(email, password)
        .subscribe(resp => {
          if (resp.status == 200) {
            this.loading = false;
            this.message.success('Login successful');
            this.router.navigateByUrl('/todos/dashboard');
          } else {
            this.loading = false;
            this.message.error('Login failed');
          }
        }, (e) => {
          console.log(e)

        })
    }

  }

  constructor(private fb: FormBuilder,
              private authservice: AuthService,
              public router: Router,
              public message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email != null) {
      this.remember = true;
      this.validateForm = this.fb.group({
        email: [email, [Validators.required, Validators.minLength(3)]],
        password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      });
    } else {
      this.validateForm = this.fb.group({
        email: [null, [Validators.required, Validators.minLength(3)]],
        password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      });
    }
  }
}
