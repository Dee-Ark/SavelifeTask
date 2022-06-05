import { LOCALSTORAGE_TOKEN_KEY } from './../../../app.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest, LoginResponse, NoteResponse, RegisterRequest, RegisterResponse } from '../../interfaces';
import { environment } from '../../../../environments/environment.prod';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

const apiBaseUrl = `${environment.apiBaseUrl}/api/v1/user`;
const apiBaseUrls = `${environment.apiBaseUrl}/api/v1/note`;

//export const fakeLoginResponse: LoginResponse = {
//  // fakeAccessToken.....should all come from real backend
//  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
//  refreshToken: {
//    id: 1,
//    userId: 2,
//    token: 'fakeRefreshToken...should al come from real backend',
//    refreshCount: 2,
//    expiryDate: new Date(),
//  },
//  tokenType: 'JWT'
//}

export const fakeRegisterResponse: RegisterResponse = {
  status: 200,
  message: 'Registration sucessfull.'
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService
  ) { }

  login(loginRequest: any): Observable<LoginResponse> {
    console.log(loginRequest);
    return this.http.post<LoginResponse>(apiBaseUrl + '/login', loginRequest).pipe(
      tap((res: LoginResponse) => localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken)),
      tap(() => this.snackbar.open('Login Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }

    register(registerRequest: any): Observable < RegisterResponse > {
      return this.http.post<RegisterResponse>(apiBaseUrl + '/', registerRequest).pipe(
        tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
        }))
      );
    }

  addNote(sendRequest: any): Observable<any> {
    return this.http.post<any>(apiBaseUrls + '/', sendRequest).pipe(
      tap((res: any) => this.snackbar.open(`Note created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }

  update(updateRequest: any): Observable<any> {
    return this.http.put<any>(apiBaseUrls + '/{note_id}', updateRequest).pipe(
      tap((res: any) => this.snackbar.open(`Note updated successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }

  delete(deleteRequest: any): Observable<any> {
    return this.http.delete<any>(apiBaseUrls + '/{note_id}', deleteRequest).pipe(
      tap((res: any) => this.snackbar.open(`Note deleted successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }

  GetAll(page: number, per_page: number): Observable<any> {
    return this.http.get<any>(apiBaseUrls + '/' + `?page=1&per_page=10`).pipe();
  }





    getLoggedInUser() {
      const decodedToken = this.jwtService.decodeToken();
      return decodedToken.user;
    }

  }
