import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wisdom',
  imports: [],
  templateUrl: './wisdom.html',
  styleUrl: './wisdom.scss',
})
export class Wisdom {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const myHeaders = new HttpHeaders();
    myHeaders.set("Cookie", "_cfuvid=l8FL6JrX8FaiQL9e7cLRQYNaLXSoxEpGTEDOhq2SpbM-1769776310145-0.0.1.1-604800000; uid=lo_a2f6f444760e");

    this.http.get<any>('https://medium.com/@kakamber07/rust-isnt-the-future-for-most-teams-617a7d3c6ea2', {headers:myHeaders, redirect: "follow"}).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log("error")
      }
    });
  }

}
