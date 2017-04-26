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
import { SalesViewComponent } from './sales-view/sales-view.component'

export const router: Routes = [
    { path: '', redirectTo: 'members', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
    { path: 'history/:id', component: HistorymembersComponent, canActivate: [AuthGuard] },
    { path: 'my-history', component: HistorymembersComponent, canActivate: [AuthGuard] },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'members', component: MembersComponent },
    { path: 'admin', component: UserAdminComponent, canActivate: [AuthGuard] },
    { path: 'sales', component: SalesViewComponent, canActivate: [AuthGuard] }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);