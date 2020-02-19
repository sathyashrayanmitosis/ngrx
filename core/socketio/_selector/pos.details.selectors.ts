// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State

import { PosDetailsState } from '../_reducers/pos.details.reducers';
import { each } from 'lodash';
import { PosDetails } from '../_models/pos-details.model';

export const selectPosState = createFeatureSelector<PosDetailsState>('pos');

export const selectPosById = (posId: number) => createSelector(
    selectPosState,
    posState => posState.entities[posId]
);

export const selectPosPageLoading = createSelector(
    selectPosState,
    posState => {
        return posState.listLoading;
    }
);

export const selectPosActionLoading = createSelector(
    selectPosState,
    posState => posState.actionsloading
);

export const selectLastCreatedPosId = createSelector(
    selectPosState,
    posState => posState.lastCreatedPosId
);

export const selectPosPageLastQuery = createSelector(
    selectPosState,
    posState => posState.lastQuery
);

export const selectPosInStore = createSelector(
    selectPosState,
    posState => {
        const items: PosDetails[] = [];
        each(posState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: PosDetails[] = httpExtension.sortArray(items, posState.lastQuery.sortField, posState.lastQuery.sortOrder);
        return new QueryResultsModel(result, posState.totalCount, '');
    }
);

export const selectPosShowInitWaitingMessage = createSelector(
    selectPosState,
    posState => posState.showInitWaitingMessage
);

export const selectHasPosInStore = createSelector(
    selectPosState,
    queryResult => {
        if (!queryResult.totalCount) {
            return false;
        }

        return true;
    }
);