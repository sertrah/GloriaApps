import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InventoryComponent } from './inventory/inventory.component';
import { HistorymembersComponent } from './historymembers/historymembers.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { UserAdminComponent } from './user-admin/user-admin.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'history/:id', component: HistorymembersComponent },
    { path: 'my-history', component: HistorymembersComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: UserAdminComponent }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);