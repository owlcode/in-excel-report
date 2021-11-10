import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCardModule } from '@angular/material/card';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { InExcelReportCardComponent } from './in-excel-report-card/in-excel-report-card.component';

@NgModule({
  declarations: [
    InExcelReportCardComponent
  ],
  exports: [
    InExcelReportCardComponent,
  ],
  imports: [
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDateFnsModule,
    MatFormFieldModule,
  ]
})
export class InExcelReportModule { }
