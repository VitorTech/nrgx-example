// user.reducer.ts

import { User } from '../user/user.model';

export const LIST_USERS = '[Users HUB] Users Loaded Success';

export function usersLoggedReducer(state: User[] = [], action: any) {
  switch (action.type) {
    case LIST_USERS:
      return action.payload;
    default:
      return state;
  }
}
