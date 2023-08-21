// src/app/app.state.ts

import { User } from './user/user.model';

export interface AppState {
  readonly users: User[];
}
