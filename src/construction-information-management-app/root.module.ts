import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material.module';
import { ConstructionInformationManagementComponent } from './construction-information-management.component';
import { LoginComponent } from './authenticate-app/login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
    declarations : [
        ConstructionInformationManagementComponent,
        LoginComponent,
        HomeComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    providers: [],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
