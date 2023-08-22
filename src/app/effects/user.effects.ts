import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { EMPTY } from 'rxjs';

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

  constructor(private actions$: Actions, private usersService: UsersService) {}
}
