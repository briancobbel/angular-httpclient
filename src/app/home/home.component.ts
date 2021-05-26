import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; // importing this to inject
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //defining a products variable 
  products: any = [];

  //injecting DataService as a private dataService instance via the component constructor
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log("starting....");
    //calling the sendGetRequest() method of the service for fetching data from the JSON REST API server
    //Since the sendGetRequest() method returns the return value of the HttpClient.get() method which is 
    //an RxJS Observable, we subscribed to the returned Observable to actually send the HTTP GET request 
    //and process the HTTP response.
    this.dataService.sendGetRequest().subscribe((data: any)=>{
      this.products = data;
    })


  }

}


