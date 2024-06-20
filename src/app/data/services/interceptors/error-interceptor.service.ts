import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Ошибка на стороне клиента
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // Ошибка на стороне сервера
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
        }

        // Вывод ошибки в консоль (можно заменить на другой метод, например, показ уведомления)
        console.error(errorMessage);

        // Можно перенаправить пользователя на страницу ошибки
        // this.router.navigate(['/error-page']);

        // Возвращаем observable с ошибкой
        return throwError(errorMessage);
      })
    );
  }
}
