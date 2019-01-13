import { NgModule } from '@angular/core';

import { AuthService } from '../../shared/service/auth.service';

@NgModule({
    declarations : [
    ],
    providers: [ AuthService ],
})
export class AuthenticateAppModule { }
