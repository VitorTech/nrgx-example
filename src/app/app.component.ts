import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user/user.model';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ngrx-chat';

  users$: Observable<User[]> = this.store.select((state) => state.users);

  constructor(private store: Store<AppState>) {}
  addUser(name: string, email: string) {
    this.store.dispatch({
      type: 'ADD_USER',
      payload: <User>{
        firstName: name,
        email: email,
      },
    });
  }
  ngOnInit() {
    this.store.dispatch({ type: '[Users Page] Load Users' });
    this.users$.subscribe(users => console.log(users));
    
  }
}
