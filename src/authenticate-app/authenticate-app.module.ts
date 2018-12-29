import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
    declarations : [
        LoginComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
    ],
    providers: [],
    bootstrap: [ LoginComponent ]
})
export class AuthenticateAppModule { }
