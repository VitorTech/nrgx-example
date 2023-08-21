// user.reducer.ts

import { User } from '../user/user.model';

export const ADD_USER = 'ADD_USER';
export const LIST_USERS = '[Users Page] Load Users';

export function userReducer(state: User[] = [], action: any) {
  switch (action.type) {
    case ADD_USER:
      return [...state, action.payload];
    case LIST_USERS:
      return [...state, action.payload];
    default:
      return state;
  }
}
