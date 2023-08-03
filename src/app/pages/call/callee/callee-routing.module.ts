import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalleeComponent } from './callee.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CalleeComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalleeRoutingModule {
}
