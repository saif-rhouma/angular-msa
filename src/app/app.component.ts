import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { AzureAdDemoService } from './azure-ad-demo.service';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private azureAdDemoService: AzureAdDemoService
  ) {

  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }


  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.isUserLoggedIn = this.authService.instance.getAllAccounts().length > 0;
        this.azureAdDemoService.isUserLoggedIn.next(this.isUserLoggedIn)
      })
  }


  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest)
    } else {
      this.authService.loginRedirect()
    }
  }


  logout() {
    this.authService.logoutRedirect({ postLogoutRedirectUri: 'http://localhost:4200/' });
  }

  title = `Angular 15 [${environment.title}] - MSAL Angular v3 Sample`;
  isUserLoggedIn = false
}
