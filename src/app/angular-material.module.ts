import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSliderModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    imports: [
        //   CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSelectModule,
        MatSidenavModule,
        MatDialogModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSliderModule,
    ],
    exports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSelectModule,
        MatSidenavModule,
        MatDialogModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSliderModule
    ],
    providers: [

    ]
})

export class AngularMaterialModule { }
