import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
    exports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
    ]
})
export class MaterialModule { }
