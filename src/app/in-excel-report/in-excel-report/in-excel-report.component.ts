import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InExcelExportService } from './../in-excel-export.service';
import { InExcelReportCardComponent } from './../in-excel-report-card/in-excel-report-card.component';

@Component({
  selector: 'in-excel-report',
  templateUrl: './in-excel-report.component.html',
  styleUrls: ['./in-excel-report.component.scss']
})
export class InExcelReportComponent implements OnInit {
  cards = [{}];
  month?: Date | number;

  @ViewChildren(InExcelReportCardComponent)
  reportCards!: QueryList<InExcelReportCardComponent>;

  constructor(
    protected inExcelExportService: InExcelExportService,
  ) { }

  ngOnInit(): void {
  }

  onRemove(index: number): void {
    this.cards.splice(index, 1);
  }

  onAdd(event: Event): void {
    this.cards.push({});
  }

  onExport(event: Event): void {
    console.log(this.reportCards);
    this.inExcelExportService.createReport(Array.from(Array.from(this.reportCards)[0].daysSelected.values()));
  }

  multiExport() {
    Array.from(this.reportCards).map((card) => ({
      days: card.daysSelected,
      information: card.formGroup.value,
    }))
  }

  onMonthChange(date: Date): void {
    this.month = date;
  }
}
