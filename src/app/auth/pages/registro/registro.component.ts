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
  userImage: any;

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
      password: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userImage = file;
    }
  }

  submitForm(): void {
    this.loading = true;
    let formData = new FormData();
    const {username, email, password} = this.validateForm.value;
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (this.userImage) {
      formData.append('file', this.userImage);
    }

    this.authService.register(formData).subscribe((res) => {
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
