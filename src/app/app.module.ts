import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import pl from 'date-fns/locale/pl'
import { InExcelReportModule } from './in-excel-report/in-excel-report.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    InExcelReportModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: pl}],
  bootstrap: [AppComponent]
})
export class AppModule { }
