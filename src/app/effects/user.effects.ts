import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { LIST_USERS } from '../reducers/user.reducer';
import { User } from '../user/user.model';

@Injectable()
export class UserEffects {
  
  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType('[Users Page] Load Users'),
    mergeMap(() => this.usersService.getAll()
      .pipe(
        map((users) => ({type: '[Users API] Users Loaded Success', payload: users})),
        catchError(() => EMPTY)
      )
    )
  ));

  constructor(private actions$: Actions, private store: Store, private usersService: UsersService) {}
}
