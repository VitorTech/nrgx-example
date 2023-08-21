import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserEffects {

  @Effect()
  loadUsers$ = this.actions$
    .pipe(
      ofType('[Movies Page] Load Movies'),
      mergeMap(() => this.usersService.getAll()
        .pipe(
          map(users => ({ type: '[Movies API] Movies Loaded Success', payload: users })),
          catchError(() => EMPTY)
        ))
      )
    );

  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) {}
}
