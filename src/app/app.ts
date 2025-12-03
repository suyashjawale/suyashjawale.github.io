import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private http: HttpClient) {
    this.http.get("https://dashing-llama-639318.netlify.app/.netlify/functions/updates").subscribe({
      next:data=>{
        
      }
    })
  }
}
