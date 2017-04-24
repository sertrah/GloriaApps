import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule  } from 'angularfire2';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth.service';
import { routes } from './app.routes';
import { InventoryComponent } from './inventory/inventory.component';

import { QueryDB } from './app.conection';
import { methodCustom } from './app.methods';
import { HistorymembersComponent } from './historymembers/historymembers.component';
import { UserNavComponent } from './user-nav/user-nav.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { UserAdminComponent } from './user-admin/user-admin.component'; // <-- import the module

import { WindowRef } from './WindowRef';

var firebaseConfig = {
  apiKey: "AIzaSyABL2Mn6GNlnuw8RqNdb6Yjjs_4OM-IWnM",
  authDomain: "gloriaapps-a00ed.firebaseapp.com",
  databaseURL: "https://gloriaapps-a00ed.firebaseio.com",
  storageBucket: "gloriaapps-a00ed.appspot.com",
  messagingSenderId: "515821534014"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent,
    InventoryComponent,
    HistorymembersComponent,
    UserNavComponent,
    UserAdminComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routes
  ],
  providers: [AuthGuard,QueryDB,methodCustom, WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
