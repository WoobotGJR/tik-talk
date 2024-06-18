import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenResponse } from '../../interfaces/auth.interface';
import { catchError, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  router = inject(Router);

  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';
  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }

    return !!this.token;
  }

  login = (payload: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);

    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}token`, formData)
      .pipe(
        tap((res) => {
          this.saveTokens(res.access_token, res.refresh_token);
        }),
        catchError(this.handleError)
      );
  };

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  refreshAuthToken = () => {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}token`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((res) => {
          this.saveTokens(res.access_token, res.refresh_token);
        }),
        catchError((err: HttpErrorResponse) => {
          this.logout();
          return throwError(err);
        }),
        catchError(this.handleError)
      );
  };

  logout = () => {
    this.token = null;
    this.refreshToken = null;
    this.cookieService.delete('token');
    this.cookieService.delete('refreshToken');
    this.router.navigate(['login']);
  };

  saveTokens = (token: string, refreshToken: string) => {
    this.token = token;
    this.refreshToken = refreshToken;
    this.cookieService.set('token', token);
    this.cookieService.set('refreshToken', refreshToken);
  };
}
