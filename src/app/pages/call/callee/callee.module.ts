import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CalleeComponent } from './callee.component';
import { CalleeRoutingModule } from './callee-routing.module';

@NgModule({
  imports: [
    CalleeRoutingModule,
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    CalleeComponent
  ],
})
export class CalleeModule {
}
