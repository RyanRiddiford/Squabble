import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CallerComponent } from './caller.component';
import { CallerRoutingModule } from './caller-routing.module';

@NgModule({
  imports: [
    CallerRoutingModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    CallerComponent
  ],
})
export class CallerModule {
}
