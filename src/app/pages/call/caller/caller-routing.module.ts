import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallerComponent } from './caller.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CallerComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallerRoutingModule {
}
