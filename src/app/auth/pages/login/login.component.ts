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
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


  validateForm!: FormGroup;
  // isLoading$ = this.authFacade.isLoadingLogin$;
  // showLoginError$ = this.authFacade.hasLoginError$;
  passwordVisible = false;
  loading: boolean = false;

  submitForm(): void {
    // if (this.validateForm.valid) {
    //   const {password, userName} = this.validateForm.value;
    //   this.authFacade.login(userName, password)
    //
    // } else {
    //   Object.values(this.validateForm.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    // }
  }

  createNotification(title:string, description:string){
    this.notification.create(
      'error',
      title,
      description
    )
  }

  constructor(private fb: FormBuilder,private notification: NzNotificationService) {
    //  this.showLoginError$.pipe().subscribe(console.log)
    /*
    this.showLoginError$.subscribe( data =>{
      console.log(data)
      if(data.error){
        if(data.code == 401){
          this.createNotification('Verifique datos ingresados', 'Usuario y/o contraseña son incorrectos');
        }

        if(data.code == 429){
          this.createNotification('Inténtalo de nuevo mas tarde', 'Demasiados intentos de inicio de sesión');
        }
      }
    });
    */

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required,Validators.minLength(3),Validators.maxLength(16)]],
      password: [null, [Validators.required,Validators.minLength(3),Validators.maxLength(16)]],
    });
  }
}
