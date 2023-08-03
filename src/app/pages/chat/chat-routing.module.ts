import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ServerComponent } from "./server/server.component";

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      {
        path: 'server/:serverId',
        component: ServerComponent,
      },
      { path: '', redirectTo: 'group-chat', pathMatch: 'full' },
      { path: '**', redirectTo: 'group-chat', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
