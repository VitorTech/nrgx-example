import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './reducers/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './effects/user.effects';
import { HttpClientModule } from '@angular/common/http'
import { ChatComponent } from './components/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HubService } from 'ngx-signalr-hubservice';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { usersLoggedReducer } from './reducers/usersLogged.reducer';

@NgModule({
  declarations: [AppComponent, ChatComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    StoreModule.forRoot({ users: userReducer, usersLogged: usersLoggedReducer }), 
    EffectsModule.forRoot([UserEffects]), 
    HttpClientModule, 
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
