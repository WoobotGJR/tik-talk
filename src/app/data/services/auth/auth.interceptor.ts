import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

let refreshing$ = new BehaviorSubject<boolean>(false);

export const AuthTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) return next(req);

  if (refreshing$.value) return refreshAndProceed(authService, req, next);

  req = addToken(token, req);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return refreshAndProceed(authService, req, next);
      }

      return throwError(error);
    })
  );
};

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
): any => {
  console.log('refresh and proceed');
  if (!refreshing$.value) {
    refreshing$.next(true);
    return authService.refreshAuthToken().pipe(
      switchMap((res) => {
        console.log('refreshed', res);

        refreshing$.next(false);
        return next(addToken(res.access_token, req));
      })
    );
  }

  if (req.url.includes('refresh'))
    return next(addToken(authService.token!, req));

  return refreshing$.pipe(
    filter((refreshing) => !refreshing),
    switchMap(() => {
      return next(addToken(authService.token!, req)).pipe(
        tap(() => refreshing$.next(false))
      );
    })
  );
};

const addToken = (token: string, req: HttpRequest<any>) => {
  console.log('add token', token);
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
