import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActionListComponent } from './action-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemDetailComponent } from './item-detail/item-detail.component';

const routes: Routes = [
    {
        path: '',
        component: ActionListComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        ActionListComponent,
        ItemDetailComponent,
    ],
})

export class ActionListModule { }
