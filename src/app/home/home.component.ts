import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service'; 
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Product } from '../product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  //defining a products variable 
   products: Product[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  //injecting DataService as a private dataService instance via the component constructor
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log("starting....");
    //calling the sendGetRequest() method of the service for fetching data from the JSON REST API server
    //Since the sendGetRequest() method returns the return value of the HttpClient.get() method which is 
    //an RxJS Observable, we subscribed to the returned Observable to actually send the HTTP GET request 
    //and process the HTTP response.
    //Calling the pipe() method of the returned Observable to pipe the takeUnitl() operator and 
    //subscribed to the combined Observable
    //In the body of the subscribe() method, we add the logic to put the fetched data of the HTTP response
    //in the products array.
    //The takeUntil() operator allows a notified Observable to emit values until a value is emitted from 
    //a notifier Observable.
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      console.log(res);
      this.products = res.body;
    }) 
  }

  //When Angular destroys a component it calls the ngOnDestroy() lifecycle method which, in our case, calls 
  //the next() method to emit a value so RxJS completes all subscribed Observables
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  public firstPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.first).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      console.log(res);
      this.products = res.body;
    })
  }
  public previousPage() {

    if (this.dataService.prev !== undefined && this.dataService.prev !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.prev).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
        console.log(res);
        this.products = res.body;
      })
    }

  }
  public nextPage() {
    if (this.dataService.next !== undefined && this.dataService.next !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.next).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
        console.log(res);
        this.products = res.body;
      })
    }
  }
  public lastPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.last).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      console.log(res);
      this.products = res.body;
    })
  }



}


