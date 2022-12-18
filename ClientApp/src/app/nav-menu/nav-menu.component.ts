import { Component, OnInit } from '@angular/core';

import { Observable, map } from 'rxjs';

import { AuthorizeService } from '../authorization/authorize.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
  public isAuthenticated?: Observable<boolean>;
  public userName?: Observable<string | undefined>;
  isExpanded = false;

  constructor(private authorizeService: AuthorizeService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authorizeService.isAuthorized();
    this.userName = this.authorizeService.getUser().pipe(
      map((user) => {
        console.log({ user });

        return user?.userName;
      })
    );
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
