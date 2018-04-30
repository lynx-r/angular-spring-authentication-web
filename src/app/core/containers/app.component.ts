import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {Store} from '@ngrx/store';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {RootState} from '../reducers/reducer.reducer';
import {Location} from '@angular/common';
import {AuthService} from '../../auth/services/auth.service';
import {catchError, filter, switchMap, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <a (click)="handleBack()">Назад</a>
    <router-outlet></router-outlet>
  `,
  styles: [`
    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {

  private navigationEnd$: Observable<any>;
  private navigationStart$: Subscription;
  private navigationEndSubscription$: Subscription;
  private navigationAuthSubscription$: Subscription;

  constructor(private store: Store<RootState>,
              private router: Router,
              private location: Location,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.navigationEnd$ = this.router.events.filter(
      event =>
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
    );

    this.navigationStart$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.navigationEnd$),
      )
      .subscribe();

    this.navigationAuthSubscription$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap(() => this.authService.authenticate()
          .pipe(
            catchError(error => {
              console.log(`ПРОПУСК: Ошибка авторизации: ${error.payload}`);
              return Observable.of(error);
            })
          )
        ),
        take(1)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.navigationAuthSubscription$.unsubscribe();
    this.navigationStart$.unsubscribe();
    this.navigationEndSubscription$.unsubscribe();
  }

  handleBack() {
    this.location.back();
  }
}