import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel,HttpUtilsService } from '../../_base/crud';
import { environment } from '../../../../environments/environment';

import { PosDetails } from '../_models/pos-details.model';

const API_POS_URL = environment.apiUrl+'/chat/load-history/';

@Injectable()
export class PosService{
    constructor(private http: HttpClient,private httpUtils: HttpUtilsService) {}

    //get incomming store/customer id
    //Load history from /V1/chat/load-history/
    //assign that to the pos model
    loadChatHistory():Observable<PosDetails[]>
    {		
		let customerId = {"customerId":3,"currentPage":1};
        const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + environment.authTokenKey,
				'Content-Type': 'application/json'
			})
		};
        return this.http.post<PosDetails[]>(API_POS_URL,customerId,httpOptions);
    }

    findPos(queryParams: QueryParamsModel): Observable<QueryResultsModel> {		
		// This code imitates server calls
		return this.loadChatHistory().pipe(
			mergeMap((response: PosDetails[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);
			})
		);
	}
   
}
