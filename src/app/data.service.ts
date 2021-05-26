import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; //importing this to inject below

import {  Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //defining the REST_API_SERVER variable that holds the address of our REST API server
  private REST_API_SERVER = "http://localhost:3000/products";

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

  //This sendGetRequest() method sends a GET request to the REST API endpoint to retrieve JSON data
  public sendGetRequest(){
    //invoking the get() method of HttpClient to send GET requests to the REST API server
    return this.httpClient.get(this.REST_API_SERVER).pipe(retry(3), catchError(this.handleError));
    
  }

}
