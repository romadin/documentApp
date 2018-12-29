import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
} from '@angular/material';

@NgModule({
    exports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatToolbarModule,
        MatCardModule,
    ]
})
export class MaterialModule { }
