import { CustomerMessageService } from '../../../core/socketio/_services/customer-message.service';
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { MatPaginator, MatSort, MatDialog,MatFormFieldModule } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
// UI
import { SubheaderService } from '../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';

import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";

import {ModalService} from '../../../_modal';
import {posReducer} from '../../../core/socketio/_reducers/pos.details.reducers'


import{
  PosDetails,
  PosDetailsDatasource,
  PosPageRequested,
  selectPosPageLastQuery
}from '../../../core/socketio';

import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'kt-agentdashboard',
  templateUrl: './agentdashboard.component.html',
  styleUrls: ['./agentdashboard.component.scss'],
  providers:[CustomerMessageService]
})
export class AgentdashboardComponent implements OnInit {

  dataSource: PosDetailsDatasource;
  data$: Observable<PosDetails>;
  displayedColumns = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  
  filterStatus: string = '';
	filterCondition: string = '';
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<PosDetails>(true, []);
	posResult: PosDetails[] = [];
  private subscriptions: Subscription[] = [];
  
  private types: Array<ToastType> = ['success', 'danger', 'warning', 'info', 'primary', 'secondary', 'dark', 'light'];
  private text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...';
  bodyText: string;
  constructor(public dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
    private socket: Socket,
    private messageSocketio:CustomerMessageService,
    private toaster: Toaster,
    private modalService: ModalService
    ) { }
    
  ngOnInit() {

    /*this.socket.on('customerMessage',function (data){        
      for (const [key, value] of Object.entries(data)) {
        if(key === 'customerId'){                
          localStorage.setItem('customerId', value.toString());
          console.log(data);
          this.loadChatList();
        }
      }        
    }); */

    this.socket.on('customerMessage',(data)=>{        
      for (const [key, value] of Object.entries(data)) {
        if(key === 'customerId'){                
          localStorage.setItem('customerId', value.toString());
          console.log(data);
          this.loadChatList();
          //this.showToast();
          this.openModal('custom-modal-1');
          
          this.dataSource = new PosDetailsDatasource(this.store);
          
          const entitiesSubscription = this.dataSource.entitySubject.pipe(
            skip(1),
            distinctUntilChanged()
          ).subscribe(res => {
            this.posResult = res;
          });
         
          this.subscriptions.push(entitiesSubscription);
          const lastQuerySubscription = this.store.pipe(select(selectPosPageLastQuery)).subscribe(res => this.lastQuery = res);
          this.subscriptions.push(lastQuerySubscription);
          console.log("last query",this.lastQuery);
        }
      }        
    });

    }
    /**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
    loadChatList() {
      this.selection.clear();
      const queryParams = new QueryParamsModel(        
        'asc'
      );
	  // Call request from server	    
      this.store.dispatch(new PosPageRequested({ page: queryParams }));
      this.selection.clear();     
      
    }
    get randomType() {
      return this.types[Math.ceil((Math.random() * 8)) % this.types.length];
    }
    showToast() {
      const type = this.randomType;
      this.toaster.open({
        text: this.text,
        caption: type + ' notification',
        type: type,
      });
    }

    openModal(id: string) {
      this.modalService.open(id);
    }

    closeModal(id: string) {
      this.modalService.close(id);
    }
  }

  
     
	

