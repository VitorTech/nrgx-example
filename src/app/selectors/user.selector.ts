import { User } from '../user/user.model';
import { createSelector } from '@ngrx/store';

export interface FeatureState {
  users: User[];
}

export interface AppState {
  feature: FeatureState;
}

export const selectFeature = (state: AppState) => state.feature;

export const selectFeatureCount = createSelector(
  selectFeature,
  (state: FeatureState) => state.users
);
