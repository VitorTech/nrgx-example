import { User } from '../user/user.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface FeatureState {
  users: User[];
}

export interface UserAppState {
  feature: FeatureState;
}

export const selectUserAppState = (state: UserAppState) => state.feature;

export const selectFeatureUsers = createSelector(
  selectUserAppState,
  (state: FeatureState) => state.users
);
