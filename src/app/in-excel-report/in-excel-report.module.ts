import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InExcelExportService } from './in-excel-export.service';
import { InExcelReportCardComponent } from './in-excel-report-card/in-excel-report-card.component';
import { InExcelReportComponent } from './in-excel-report/in-excel-report.component';
import { InExcelToolbarComponent } from './in-excel-toolbar/in-excel-toolbar.component';
@NgModule({
  declarations: [
    InExcelReportCardComponent,
    InExcelToolbarComponent,
    InExcelReportComponent,
  ],
  exports: [
    InExcelReportComponent,
    InExcelToolbarComponent,
    InExcelReportCardComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDateFnsModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    InExcelExportService,
  ],
})
export class InExcelReportModule {}
