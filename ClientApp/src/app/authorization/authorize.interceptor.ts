import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpStatusCode,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, catchError, of, throwError } from 'rxjs';

import { AuthorizeService } from './authorize.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeInterceptor implements HttpInterceptor {
  token?: string;

  constructor(
    private authorizeService: AuthorizeService,
    private router: Router
  ) {
    authorizeService.getToken().subscribe((token) => {
      this.token = token;
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return next.handle(clonedRequest).pipe(
      catchError((err) => {
        if (err.status === HttpStatusCode.Unauthorized) {
          this.authorizeService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
