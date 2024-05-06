import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalService, MsalGuard, MsalInterceptor, MsalBroadcastService, MsalRedirectComponent } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AzureAdDemoService } from './azure-ad-demo.service';
import { environment } from '../environment/environment';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent
  ],
  // imports: [
  //   BrowserModule,
  //   AppRoutingModule,
  // ],
  imports: [
    MsalModule.forRoot(new PublicClientApplication({ // MSAL Configuration
      auth: {
        clientId: environment.app_azure_client_id,
        authority: `https://login.microsoftonline.com/${environment.app_azure_tenant_id}`,
        redirectUri: "http://localhost:4200/",
        navigateToLoginRequestUrl: false,
        knownAuthorities: [],
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: true, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback: () => { },
          piiLoggingEnabled: false
        }
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['https://api.myapplication.com/users/*', ['customscope.read']],
        ['http://localhost:4200/about/', null]
      ])
    }),
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    AzureAdDemoService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
