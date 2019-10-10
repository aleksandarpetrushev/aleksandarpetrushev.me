import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  model: any = {};

  constructor(
    private router: Router,
    private httpClient: HttpClient
   ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const url = 'https://usebasin.com/f/6f025f9579a3.json';
    this.httpClient.post(url, this.model, {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    }).subscribe();
    this.router.navigateByUrl('/success');
  }
}
