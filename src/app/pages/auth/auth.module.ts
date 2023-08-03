import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from "./auth-routing.module";
import { RegisterComponent } from "./register/register.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SsoComponent} from "./sso/sso.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {AuthComponent} from "./auth.component";
import {LoginComponent} from "./login/login.component";
import {BlocksBackgroundComponent} from "../../components/blocks-background/blocks-background.component";

@NgModule({
  declarations: [
    AuthComponent,
    RegisterComponent,
    ResetPasswordComponent,
    SsoComponent,
    LoginComponent,
    BlocksBackgroundComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
