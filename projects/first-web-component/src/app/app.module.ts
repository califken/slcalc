import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { UIButtonComponent } from './uibutton/uibutton.component';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { MdbModule } from 'mdb-angular-ui-kit';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbFormsModule } from 'mdb-angular-ui-kit';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    UIButtonComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    MdbModule,
    MdbFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule
  ],
  entryComponents: [UIButtonComponent],
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {
    const webComponent = createCustomElement(UIButtonComponent, {injector});
    customElements.define('ui-button', webComponent);
  }

  ngDoBootstrap() {}
 }
