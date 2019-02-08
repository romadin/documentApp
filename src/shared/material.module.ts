import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule, MatDialogModule, MatExpansionModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatOptionModule, MatSelectModule, MatTableModule,
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
        MatExpansionModule,
        MatTableModule,
    ]
})
export class MaterialModule { }
