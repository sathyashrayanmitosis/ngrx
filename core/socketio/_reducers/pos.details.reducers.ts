// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PosActions,PosActionTypes } from '../_actions/pos.details.action';
// CRUD
import { QueryParamsModel } from '../../_base/crud';

// Models
import { PosDetails } from '../_models/pos-details.model';

export interface PosDetailsState extends EntityState<PosDetails>{
    listLoading: boolean;
    actionsloading: boolean;
    totalCount: number;
    lastCreatedPosId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<PosDetails> = createEntityAdapter<PosDetails>();

export const initialPosState: PosDetailsState = adapter.getInitialState({
    listLoading: false,
    actionsloading: false,
    totalCount: 0,
    lastQuery:  new QueryParamsModel({}),
    lastCreatedPosId: undefined,
    showInitWaitingMessage: true
});

export function posReducer(state = initialPosState, action: PosActions): PosDetailsState {

    switch(action.type){
        
        case PosActionTypes.PosPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedPosId: undefined
        };
        case PosActionTypes.PosActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case PosActionTypes.PosOnServerCreated: return {
            ...state
        };
        case PosActionTypes.PosCreated: return adapter.addOne(action.payload.pos, {
            ...state, lastCreatedUserId: action.payload.pos.entity_id
        });
        case PosActionTypes.PosUpdated: return adapter.updateOne(action.payload.partialPos, state);
        case PosActionTypes.PosDeleted: return adapter.removeOne(action.payload.id, state);
        case PosActionTypes.PosPageCancelled: return {
            ...state, listLoading: false, lastQuery: new QueryParamsModel({})
        };
        case PosActionTypes.PosPageLoaded: {
            return adapter.addMany(action.payload.pos, {
                ...initialPosState,
                totalCount: action.payload.totalCount,
                lastQuery: action.payload.page,
                listLoading: false,
                showInitWaitingMessage: false
            });
        }
        default: return state;
    }

}

export const getPosState = createFeatureSelector<PosDetails>('pos');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();