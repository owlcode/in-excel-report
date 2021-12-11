import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { format, toDate } from 'date-fns';
import { pl } from 'date-fns/locale';
import ls from 'localstorage-slim';
import { BehaviorSubject } from 'rxjs';
import { InExcelExportService } from './../in-excel-export.service';
@Component({
  selector: 'in-empty-calendar-header',
  template: '',
  styles: [':host { display: block; min-width: 200px;}'],
})
export class InEmptyCalendarHeader {
  // TODO: Add possibility to change years through this header
}

export interface InExcelToolbarState {
  client: string;
  selectedMonth: Date;
}

@Component({
  selector: 'in-excel-toolbar',
  templateUrl: './in-excel-toolbar.component.html',
  styleUrls: ['./in-excel-toolbar.component.scss'],
})
export class InExcelToolbarComponent {
  // Used to pick default reporting month. First 3 days of month pick previous month
  readonly now = Date.now() - 3 * 24 * 60 * 60 * 1000;
  readonly selectedMonthFormat = 'LLLL yyyy';
  emptyHeaderComponent = InEmptyCalendarHeader;
  formGroup = this.inExcelExportService.formGroup;
  name = new FormControl(ls.get('client') || '', [Validators.required]);
  isMenuOpened = new BehaviorSubject<boolean>(false);
  month = format(this.now, this.selectedMonthFormat, {
    locale: pl,
  });

  @Output()
  export = new EventEmitter<Event>();

  @Output()
  valueChange = new EventEmitter();

  @Output()
  selectedMonthChange = new EventEmitter<Date>();

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(protected inExcelExportService: InExcelExportService) {}

  ngOnInit() {
    this.selectedMonthChange.next(toDate(this.now));
  }

  onSelectMonth() {
    this.isMenuOpened.next(true);
  }

  onExport(ev: Event): void {
    this.export.emit(ev);
  }

  monthSelected(date: Date) {
    this.month = format(date, this.selectedMonthFormat, {
      locale: pl,
    });
    this.selectedMonthChange.next(date);
    this.isMenuOpened.next(false);
    this.menuTrigger.closeMenu();
  }
}
