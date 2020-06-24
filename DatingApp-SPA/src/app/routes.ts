
import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved.guards';

export const appRoutes: Routes = [
    // ordering is important
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'lists', component: ListsComponent},
      {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
      // users/user of type resolver to pass up to component
      {path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver} },
      {path: 'member/edit', component: MemberEditComponent, resolve: {user: MemberEditResolver}, canDeactivate:[PreventUnsavedChanges] },
      // get id from decoded token in appmodule.ts
      {path: 'messages', component: MessagesComponent}
    ]
  },
  {path: 'nav', component: NavComponent},
  {path: 'register', component: RegisterComponent},
  // wild card route component
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
