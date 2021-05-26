import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'; //importing this to inject below

import { throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //defining the REST_API_SERVER variable that holds the address of our REST API server
  private REST_API_SERVER = "http://localhost:3000/products";

  //defining string variables for pagination
  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  //injecting the HttpClient service as a private httpClient instance
  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  //defining the parseLinkHeader() method which parses the Link header and populate the previous variables accordingly:
  parseLinkHeader(header: any) {
    if (header.length == 0) {
      return ;
    }

    let parts = header.split(',');
    const links: {[index: string]:any} = {};

    parts.forEach( (p: string) => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });

    this.first  = links["first"];
    this.last   = links["last"];
    this.prev   = links["prev"];
    this.next   = links["next"]; 
  }


  //This sendGetRequest() method sends a GET request to the REST API endpoint to retrieve JSON data
  public sendGetRequest(){

    //Invoking the get() method of HttpClient to send GET requests to the REST API server.
    //Adding the observe option with the response value in the options parameter of the get() method 
    //so we can have the full HTTP response with headers. 
    //Next, we use the RxJS tap() operator for parsing the Link header before returning the final Observable.
    return this.httpClient.get<Product[]>(this.REST_API_SERVER, {  params: new HttpParams({fromString: "_page=1&_limit=5"}), observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
    
  }

  public sendGetRequestToUrl(url: string){
    return this.httpClient.get<Product[]>(url, { observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));

    }));
  }



}
