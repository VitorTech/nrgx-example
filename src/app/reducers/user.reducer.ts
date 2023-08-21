// user.reducer.ts

import { User } from '../user/user.model';

export const ADD_USER = 'ADD_USER';
export const LIST_USERS = '[Users API] Users Loaded Success';

export function userReducer(state: User[] = [], action: any) {
  switch (action.type) {
    case ADD_USER:
      return [...state, action.payload];
    case LIST_USERS:
      return action.payload.users;
    default:
      return state;
  }
}
