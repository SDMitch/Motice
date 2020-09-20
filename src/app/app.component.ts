import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public enviro: boolean = environment.production;

  constructor( public authService: AuthService ) { }

  ngOnInit() {

  }

  logout() {
    
  }

}
