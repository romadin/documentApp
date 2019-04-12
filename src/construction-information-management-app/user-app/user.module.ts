import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersOverviewComponent } from './users/users-overview.component';
import { SharedModule } from '../../shared/shared.module';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { UserResolver } from '../../shared/packages/user-package/user.resolver';
import { CanActivateAdminUser } from '../../can-activate/CanActivateAdminUser';

const routes: Routes = [
    {
        path: '',
        component: UsersOverviewComponent,
        canActivate: [ CanActivateAdminUser ]
    },
    {
        path: 'activate/:token',
        component: ActivateUserComponent,
        resolve: { user: UserResolver }
    },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        UsersOverviewComponent,
        ActivateUserComponent,
    ],
    providers: [
        UserResolver,
        CanActivateAdminUser,
    ],
})

export class UserModule {  }
