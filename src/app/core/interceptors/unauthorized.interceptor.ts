import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()

export class UnauthorizedInterceptor implements HttpInterceptor {
  //constructor(private router: Router) { }
  errorMessage = '';
  constructor(private router: Router, private snackbar: MatSnackBar) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.snackbar.open(error.error.message, 'Close', {
              duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            })
          }
         

          if (error.status == 400) {
            this.snackbar.open(error.error.message, 'Close', {
              duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            })
          }



          
          return throwError(this.errorMessage);
        })
      )
  }
}
