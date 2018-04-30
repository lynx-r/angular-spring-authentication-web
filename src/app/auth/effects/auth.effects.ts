import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Effect, Actions, ofType} from '@ngrx/effects';

import {AuthService} from '../services/auth.service';
import {catchError, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {AuthActionTypes, Login, LoginSuccess, Register, RegisterSuccess} from '../actions/auth';
import {AuthUser} from '../models/registerUser';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthEffects {
  @Effect()
  register$ = this.actions$
    .pipe(
      ofType(AuthActionTypes.REGISTER),
      map((action: Register) => action.payload),
      switchMap(credentials =>
        this.authService.register(credentials)
          .pipe(
            mergeMap(user => [
              new RegisterSuccess(user as AuthUser),
              new LoginSuccess(user as AuthUser)
            ]),
            tap(() => this.router.navigate(['/'])),
            catchError((error) => {
              return Observable.of(error);
            })
          )
      )
    );

  @Effect()
  login$ = this.actions$
    .pipe(
      ofType(AuthActionTypes.LOGIN),
      map((action: Login) => action.payload),
      switchMap(credentials =>
        this.authService.authorize(credentials)
          .pipe(
            map((user) => new LoginSuccess(user as AuthUser)),
            tap(() =>
              this.router.navigate(['/'])
            ),
            catchError((error) => {
              return Observable.of(error);
            })
          )
      ),
    );

  @Effect()
  logout$ = this.actions$
    .pipe(
      ofType(AuthActionTypes.LOGOUT),
      switchMap(() =>
        this.authService
          .logout()
          .pipe(
            tap(() => this.router.navigate(['/auth/SignIn'])),
            catchError((error) => {
              return Observable.of(error);
            })
          )
      ),
    );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
  }
}
