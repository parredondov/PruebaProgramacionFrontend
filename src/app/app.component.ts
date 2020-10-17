
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TitleService } from './_services/title.service';
import { User } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: User;

  title :string;


  @ViewChild('drawer', { static: false }) drawer: any;
  subscription: Subscription;
  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result: BreakpointState) => result.matches), shareReplay());
  titleIsVisible: boolean;


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private titleService : TitleService) {

    this.authenticationService.currentUser.subscribe(x => { this.currentUser = x;});

    //this.db = new DBService();
    //Cuando se escoge la orden, seteo en el toolbar la informacin
    this.subscription = this.titleService.getTitle().subscribe(title => {
      if (title) {
        this.title = title.text;
      } else {
        this.title = null;
      }
    });

  }

  ngOnInit(){

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


  closeSideNav() {
    if (this.drawer._mode == "over") {
      this.drawer.close();
    }
  }

}
