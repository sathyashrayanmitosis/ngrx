// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { PosService } from '../_services';

// State
import { AppState } from '../../../core/reducers';

import {
    PosActionTypes,
    PosPageRequested,
    PosPageLoaded,
    PosCreated,
    PosDeleted,
    PosUpdated,
    PosOnServerCreated,
    PosActionToggleLoading,
    PosPageToggleLoading
} from '../_actions/pos.details.action';

@Injectable()
export class PosEffects{

    constructor(private actions$: Actions, private pos: PosService, private store: Store<AppState>) { }

    showPageLoadingDistpatcher = new PosPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new PosPageToggleLoading({ isLoading: false });    
    hideActionLoadingDistpatcher = new PosPageToggleLoading({ isLoading: false });
    @Effect()
    loadPosPage$ = this.actions$.pipe(
        ofType<PosPageRequested>(PosActionTypes.PosPageRequested),
        mergeMap(( { payload } ) => {            
            this.store.dispatch(this.showPageLoadingDistpatcher);
            const requestToServer = this.pos.findPos(payload.page);
            const lastQuery = of(payload.page);
            return forkJoin(requestToServer, lastQuery);
        }),
        map(response => {
            const result: QueryResultsModel = response[0];
            const lastQuery: QueryParamsModel = response[1];
            return new PosPageLoaded({
                pos: result.items,
                totalCount: result.totalCount,
                page: lastQuery
            });
        })
    );
}