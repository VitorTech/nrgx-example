import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { addUserReducer } from './reducers/user.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StoreModule.forRoot({ users: addUserReducer })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
