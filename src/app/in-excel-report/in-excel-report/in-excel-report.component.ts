import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InExcelExportService } from './../in-excel-export.service';
import { InExcelReportCardComponent } from './../in-excel-report-card/in-excel-report-card.component';

@Component({
  selector: 'in-excel-report',
  templateUrl: './in-excel-report.component.html',
  styleUrls: ['./in-excel-report.component.scss'],
})
export class InExcelReportComponent {
  cards = [{}];
  month?: Date | number;

  @ViewChildren(InExcelReportCardComponent)
  reportCards!: QueryList<InExcelReportCardComponent>;

  constructor(protected inExcelExportService: InExcelExportService) {}

  onRemove(index: number): void {
    this.cards.splice(index, 1);
  }

  onAdd(): void {
    this.cards.push({});
  }

  onExport(): void {
    const data = this.inExcelExportService.createMultiReport(
      Array.from(this.reportCards).map(({ formGroup, daysSelected }) => {
        const formValue = formGroup.value;
        const selectedDays = daysSelected;
        return {
          ...formValue,
          selectedDays,
        };
      })
    );
    this.inExcelExportService.createReport(data);
  }

  onMonthChange(date: Date): void {
    this.month = date;
  }
}
