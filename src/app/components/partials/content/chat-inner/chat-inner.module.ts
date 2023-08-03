import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatIconModule } from '@angular/material/icon';
import { ChatInnerComponent } from './chat-inner.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ChatInnerComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    MatIconModule,
    ScrollingModule,
    FormsModule,
    NgxDropzoneModule,
    MatButtonModule,
  ],
  exports: [ChatInnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatInnerModule {}
