import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {SigninPageComponent} from './containers/signin-page.component';

import {AuthEffects} from './effects/auth.effects';
import {SigninComponent} from './components/signin.component';
import {SignupComponent} from './components/signup.component';
import {SignupPageComponent} from './containers/signup-page.component';
import {reducers} from './reducers';
import {AuthService} from '../core/services/auth.service';
import {ErrorHandlingService} from '../core/services/error-handling.service';
import {SecurityService} from '../core/services/security.service';
import {ApiSecurityService} from '../core/services/api-security.service';
import {AuthRoutingModule} from './auth-routing.module';
import {ServicesModule} from '../core/services/services.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
    ServicesModule
  ],
  declarations: [
    SigninComponent,
    SignupComponent,
    SigninPageComponent,
    SignupPageComponent,
  ],
  exports: [
    SigninPageComponent,
    SignupPageComponent
  ],
  providers: [
    ErrorHandlingService
  ]
})
export class AuthModule {
}
