import { Component, OnInit, Input } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { removeDuplicatesFromArray } from '../utils/array.utils';
import { UserLogged } from '../models/UserLogged';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() userName: string | null = '';

  title = 'chat-ui';
  text: string = '';
  userLogged: UserLogged = JSON.parse(localStorage.getItem('user') as string);
  
  contactedUserId: string = '';

//   users$: Observable<User[]> = this.store.select((state) => state.users);
  users$: Observable<User[]> = this.store.select(e => {
      const uniqueUsersByEmail = removeDuplicatesFromArray(e.users, 'emailId');
      const uniqueUsersByPhone = removeDuplicatesFromArray(uniqueUsersByEmail, 'phoneNumber');

      return uniqueUsersByPhone;
    
  });

  // usersLogged: any = this.store.select();
 
  constructor(private store: Store<AppState>, public signalRService: SignalrService) {

  }

  ngOnInit(): void {
    this.store.dispatch({ type: '[Users Page] Load Users' })

    this.users$.subscribe(users => console.log(users));
    // this.signalRService.connect();
  }

  sendMessage(): void {
    const loggedUser: UserLogged = JSON.parse(localStorage.getItem('user') as string);

    this.signalRService.sendMessageToHub(this.text, loggedUser).subscribe({
      next: _ => this.text = '',
      error: (err) => console.error(err)
    });

    // this.signalRService.sendMessageToHub(this.text, this.userName).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });
  }

  talkToUser(userId: string, event: Event) {
    const element = event.target as HTMLElement;
    element.classList.remove('active');
    
    const loggedUser: UserLogged = JSON.parse(localStorage.getItem('user') as string);

    this.signalRService.talkToUser(loggedUser.id, userId);
  }



}