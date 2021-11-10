import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { eachWeekOfInterval, subDays, isWeekend, startOfMonth, eachDayOfInterval, endOfMonth, lastDayOfMonth, parseISO, getWeek, format, addDays } from 'date-fns';
import { groupBy } from 'lodash';
import * as XLSX from 'xlsx';
import ls from 'localstorage-slim';
import { map, Subscription, tap } from 'rxjs';


export interface ReportConfig {
  client: string;
  user: string;
}

@Component({
  selector: 'in-excel-report-card',
  templateUrl: './in-excel-report-card.component.html',
  styleUrls: ['./in-excel-report-card.component.scss']
})
export class InExcelReportCardComponent implements OnInit {
  readonly dateFormat = 'yyyy-MM-dd';
  readonly reportColumns = [
    ["LOG_DATE_FROM", "LOG_DATE_TO", "LOG_CLIENT", "LOG_ISSUE_NAME", "LOG_PROJECT_HOURS", "LOG_INTERNAL_HOURS"],
  ];
  daysSelected = new Set(this.getWorkingDaysList())
  @ViewChild('calendar') calendar!: MatCalendar<Date>;
  reportFormGroup = new FormGroup({
    client: new FormControl(ls.get('client') || '', [Validators.required]),
    user: new FormControl(ls.get('user') || '', [Validators.required, Validators.minLength(2)]),
  });

  updateLs$ = this.reportFormGroup.valueChanges.pipe(tap((reportConfig: ReportConfig) => {
    Object.entries(reportConfig).forEach(([key, value]) => {
      ls.set(key, value);
    })

  }))
  subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(this.updateLs$.subscribe())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isSelected = (event: any, time: any): string => {
    const beforeDate = format(subDays(event, 1), this.dateFormat);
    const date = format(event, this.dateFormat);
    const afterDate = format(addDays(event, 1), this.dateFormat);
    if (this.daysSelected.has(date)) {
      if (this.daysSelected.has(beforeDate) && this.daysSelected.has(afterDate)) {
        return 'middle-selected';
      }

      if (this.daysSelected.has(beforeDate)) {
        return 'last-selected';
      }

      if (this.daysSelected.has(afterDate)) {
        return 'first-selected';
      }

      return 'selected';
    }

    return '';
  };

  getWorkingDaysList(): string[] {
    const start = startOfMonth(Date.now());
    const end = lastDayOfMonth(Date.now());
    return eachDayOfInterval({ start, end })
      .filter((date) => !isWeekend(date))
      .map((date) => format(date, this.dateFormat))
  }

  select(event: Date) {
    const date = format(event, this.dateFormat);
    if (this.daysSelected.has(date)) {
      this.daysSelected.delete(date);
    } else {
      this.daysSelected.add(date);
    }
    this.calendar.updateTodaysDate();
  }

  monthSelected(event: any) {
    console.log('month sleected', event);
  }
  viewChanged(event: any) {
    console.log(event);
  }
  createReport() {
    const wb = XLSX.utils.book_new();
    const ws_name = "Sheet 1";
    const ws_data = [...this.reportColumns];
    const firstDay = startOfMonth(this.calendar.activeDate);
    const lastDay = lastDayOfMonth(this.calendar.activeDate);
    const intervals = eachWeekOfInterval({
      start: startOfMonth(this.calendar.activeDate),
      end: endOfMonth(this.calendar.activeDate)
    }, {
      weekStartsOn: 1
    });
    const daysInWeek = groupBy(this.getSelectedArray().map((day) => parseISO(day)), getWeek)
    const sumProjectHours = this.getSelectedArray().length * 8;
    intervals.forEach((interval, index) => {
      ws_data.push([
        format(index === 0 ? firstDay : interval, this.dateFormat),
        format(index === intervals.length - 1 ? lastDay : addDays(interval, 6), this.dateFormat),
        this.reportFormGroup.get('client')?.value,
        'Projekt',
        ((daysInWeek[getWeek(interval)]?.length || 0) * 8).toString(),
        (0).toString()
      ])
    })
    ws_data.push([]);
    ws_data.push([]);
    ws_data.push(['', '', '', '', sumProjectHours.toString()]);
    const fileName = `${this.reportFormGroup.get('user')?.value}_${format(this.calendar.activeDate, 'yyyy_MM')}.xlsx`;
    console.log('Saving ' + fileName, ws_data);
    const sheet = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, sheet, ws_name);
    XLSX.writeFile(wb, fileName);
  }

  getSelectedArray(): string[] {
    return Array.from(this.daysSelected.values());
  }

}
