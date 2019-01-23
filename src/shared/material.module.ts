import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule, MatDialogModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatOptionModule, MatSelectModule,
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
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatOptionModule,
        MatListModule,
    ]
})
export class MaterialModule { }
