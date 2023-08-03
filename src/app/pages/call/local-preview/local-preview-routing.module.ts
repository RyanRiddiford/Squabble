import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalPreviewComponent } from './local-preview.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LocalPreviewComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalPreviewRoutingModule {
}
