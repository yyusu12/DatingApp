
import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
    // ordering is important
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'lists', component: ListsComponent},
      {path: 'members', component: MemberListComponent},
      {path: 'messages', component: MessagesComponent}
    ]
  },
  {path: 'nav', component: NavComponent},
  {path: 'register', component: RegisterComponent},
  // wild card route component
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
