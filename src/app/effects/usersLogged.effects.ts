import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { EMPTY } from 'rxjs';

@Injectable()
export class UserLoggedEffects {
  
  loadUsersLogged$ = createEffect(() => this.actions$.pipe(
    ofType('[Users HUB] Load Users'),
    mergeMap(() => this.usersService.getHubUsers()
      .pipe(
        map((users) => ({type: '[Users HUB] Users Loaded Success', payload: users})),
        catchError(() => EMPTY)
      )
    )
  ));

  constructor(private actions$: Actions, private usersService: UsersService) {}
}
