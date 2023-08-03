import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CalleeComponent } from './call/callee/callee.component';
import { CallerComponent } from './call/caller/caller.component';
import { LocalPreviewComponent } from './call/local-preview/local-preview.component';
import { PostLoginLayoutComponent } from './layout/post-login-layout/post-login-layout.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'dashboard',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'chat',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/chat/chat.module').then(m => m.ChatModule)
      },
      {
        path: 'local-preview',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/call/local-preview/local-preview.module').then(m => m.LocalPreviewModule)
      },
      {
        path: 'caller',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/call/caller/caller.module').then(m => m.CallerModule)
      },
      {
        path: 'callee',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/call/callee/callee.module').then(m => m.CalleeModule)
      },
      {
        path: 'contacts',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/contacts/contacts.module').then(m => m.ContactsModule)
      },
      {
        path: 'kanban',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/kanban/kanban.module').then(m => m.KanbanModule)
      },
      {
        path: 'profile',
        component: PostLoginLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
