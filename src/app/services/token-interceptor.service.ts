import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private refreshingInProgress: boolean = false;
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {

  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.authService.token;
    return next.handle(this.addAuthorizationHeader(req, jwtToken)).pipe(
      catchError(
        err => {
          if (req.url.indexOf("/refresh") > 0) {
            return this.logoutAndRedirect(err);
          }

          if (err instanceof HttpErrorResponse && err.status === 401) {
            const refreshToken = this.authService.refreshToken;
            if (refreshToken && jwtToken) {
              return this.refreshToken(req, next);
            }
            return this.logoutAndRedirect(err);
          }

          if (err instanceof HttpErrorResponse && err.status === 403) {
            return this.logoutAndRedirect(err);
          }

          if (err.status === 400) {
            this.alertService.showAlert(err.error, 'FAILED');
          }

          if (err.status === 500) {
            this.alertService.showAlert('There is an issue that occurs on the server. Please try after some time.', 'SERVER ERROR');
          }
          return throwError(() => err);
        })
    );
  }


  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return request;
  }

  private logoutAndRedirect(err: HttpErrorResponse): Observable<HttpEvent<any>> {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    return throwError(() => err);
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      this.accessTokenSubject.next('');

      return this.authService.RefreshTokens().pipe(
        switchMap((res) => {
          this.refreshingInProgress = false;
          this.accessTokenSubject.next(this.authService.token);
          return next.handle(this.addAuthorizationHeader(request, this.authService.token));
        }), catchError((err, caught) => {
          return this.logoutAndRedirect(err);
        })
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter(token => token !== ''),
        take(1),
        switchMap(token => {
          return next.handle(this.addAuthorizationHeader(request, token));
        }));
    }
  }


}
