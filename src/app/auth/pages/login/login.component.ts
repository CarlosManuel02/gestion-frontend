import {Component, OnInit} from '@angular/core';
import {NzTypographyComponent} from "ng-zorro-antd/typography";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


  validateForm!: FormGroup;
  passwordVisible = false;
  loading: boolean = false;

  login() {
    console.log(this.validateForm.value)
    this.loading = true;
    const {email, password} = this.validateForm.value;
    if (email != null && password != null) {
      this.authservice.login(email, password)
        .subscribe(resp => {
          if (resp.status == 200) {
            this.loading = false;
            this.message.success('Login successful');
            this.router.navigateByUrl('/todos/dashboard');
          } else {
            this.loading = false;
            this.message.error(resp.message);
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
    this.validateForm = this.fb.group({
      email: [null, [Validators.required,Validators.minLength(3)]],
      password: [null, [Validators.required,Validators.minLength(3),Validators.maxLength(16)]],
    });
  }
}
