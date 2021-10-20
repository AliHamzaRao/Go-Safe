import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

export const TOKEN_NAME: string = 'jwt_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  helper = new JwtHelperService();
  private url: string = 'api/auth';
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAuthorizationToken() {
    return 'some-auth-token';
  }
  getToken(): string {
    return localStorage.getItem("token");
  }

  setToken(token: string): void {
    debugger;
    localStorage.setItem("token", token);
  }

  // getTokenExpirationDate(token: string): Date {
  //   const decoded = jwt_decode(token);

  //   if (decoded.exp === undefined) return null;

  //   const date = new Date(0); 
  //   date.setUTCSeconds(decoded.exp);
  //   return date;
  // }

  // isTokenExpired(token?: string): boolean {
  //   if(!token) token = this.getToken();
  //   if(!token) return true;

  //   const date = this.getTokenExpirationDate(token);
  //   if(date === undefined) return false;
  //   return !(date.valueOf() > new Date().valueOf());
  // }

  // login(user): Promise<string> {
  //   return this.http
  //     .post(`${this.url}/login`, JSON.stringify(user), { headers: this.headers })
  //     .toPromise()
  //     .then(res => res.text());
  // }


  // getUser():UserInfo {
  //   return this.user;
  // }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token !== null && token !== '' && token !== undefined)
    {
      return true;
    }
    return false;
  }
}
