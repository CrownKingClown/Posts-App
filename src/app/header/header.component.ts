import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated: boolean;
  constructor(private authService: AuthService) {

  }// This is a constructor that takes an argument of type AuthService
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
   }
  ngOnInit(): void {
     this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
       this.userIsAuthenticated = isAuthenticated;
     });
  }
  onLogout() {
    this.authService.logout();

  }
 

}
