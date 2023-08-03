import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    PagesRoutingModule,
    TooltipModule
  ],
  declarations: [
    PagesComponent
  ],
})
export class PagesModule {
}
