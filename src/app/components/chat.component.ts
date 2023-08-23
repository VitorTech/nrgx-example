import { Component, OnInit, Input } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { removeDuplicates } from '../utils/array.utils';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() userName: string | null = '';

  title = 'chat-ui';
  text: string = '';
  userLogged: string | null = localStorage.getItem('user');

//   users$: Observable<User[]> = this.store.select((state) => state.users);
  users$: Observable<User[]> = this.store.select(e => {
      const uniqueUsersByEmail = removeDuplicates(e.users, 'emailId');
      const uniqueUsersByPhone = removeDuplicates(uniqueUsersByEmail, 'phoneNumber');

      return uniqueUsersByPhone;
    
  });
 
  constructor(private store: Store<AppState>, public signalRService: SignalrService) {

  }

  ngOnInit(): void {
    this.store.dispatch({ type: '[Users Page] Load Users' })

    this.users$.subscribe(users => console.log(users));
    // this.signalRService.connect();
  }

  sendMessage(): void {
    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });

    this.signalRService.sendMessageToHub(this.text, this.userName).subscribe({
      next: _ => this.text = '',
      error: (err) => console.error(err)
    });
  }

}