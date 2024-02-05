import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  token = '';
  refreshToken = '';
  username = '';
  roles: any[] = [];

  constructor(
    private http: HttpClient,
    private alretService: AlertService
  ) {
    this.loadToken();
  }


  loadToken() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      this.token = token;
      this.refreshToken = localStorage.getItem("refreshToken")!;

      const payload = token.split('.')[1];
      const decoded = window.atob(payload);
      const values = JSON.parse(decoded);
      this.roles = values.role;
      this.username = values.unique_name;
      this.isAuthenticated.next(true);
    }
    else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: any): Promise<boolean> {
    return new Promise(async resolve => {
      this.http.post(`${environment.apiURL}/api/accounts/login`, credentials).subscribe(
        (data: any) => {
          if (data) {
            localStorage.setItem('jwtToken', data.jwtToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('expired', data.expired);
            this.loadToken();
            resolve(true)
          }
          else {
            resolve(false)
          }
        },
        err => {
          if (err.status > 0) {
            this.alretService.showAlert(err.error ?? '', 'LOGIN FAILED');
          }
          else {
            this.alretService.showAlert('', 'LOGIN FAILED');
          }
        }
      );
    });
  }

  RefreshTokens() {
    return new Observable(x => {
      const requestbody = {
        jwtToken: this.token,
        refreshToken: this.refreshToken
      };
      this.http.post(`${environment.apiURL}/api/accounts/refresh`, requestbody).subscribe(
        (data: any) => {
          if (data) {
            localStorage.setItem('jwtToken', data.jwtToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('expired', data.expired);
            this.loadToken();
          }
          x.next(data);
          x.complete();
        });
    });
  }

  logout() {
    if (this.token.length > 2) {
      const tmp_token = this.token;
      this.token = '';
      this.username = '';
      this.roles = [];
      localStorage.clear();
      this.isAuthenticated.next(false);
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${tmp_token}` });
      this.http.post(`${environment.apiURL}/api/accounts/logout`, '', { headers, responseType: 'json', }).subscribe();
    }
  }


}
