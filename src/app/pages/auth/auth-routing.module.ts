import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SsoComponent } from './sso/sso.component';
import { AuthComponent } from "./auth.component";

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'register',
      component: RegisterComponent,
    },
    {
      path: 'reset-password',
      component: ResetPasswordComponent
    },
    {
      path: 'sso',
      component: SsoComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
