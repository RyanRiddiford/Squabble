import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocalPreviewComponent } from './local-preview.component';
import { LocalPreviewRoutingModule } from './local-preview-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LocalPreviewRoutingModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    LocalPreviewComponent
  ],
})
export class LocalPreviewModule {
}
