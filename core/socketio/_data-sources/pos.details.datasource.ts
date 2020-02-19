// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../../core/reducers';

import { selectPosInStore, selectPosPageLoading, selectPosShowInitWaitingMessage } from '../_selector/pos.details.selectors';

export class PosDetailsDatasource extends BaseDataSource {
    constructor(private store: Store<AppState>) {

        super();

        this.loading$ = this.store.pipe(
			select(selectPosPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectPosShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectPosInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

    }
}