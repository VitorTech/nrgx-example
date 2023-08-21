import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './reducers/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './effects/user.effects';
import { HttpClientModule } from '@angular/common/http'
import { ChatComponent } from './components/chat.component';
import { FormsModule } from '@angular/forms';
import { HubService } from 'ngx-signalr-hubservice'; 

@NgModule({
  declarations: [AppComponent, ChatComponent],
  imports: [BrowserModule, StoreModule.forRoot({ users: userReducer }), EffectsModule.forRoot([UserEffects]), HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
