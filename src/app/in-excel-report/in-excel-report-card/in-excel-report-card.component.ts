import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { addDays, eachDayOfInterval, format, isWeekend, lastDayOfMonth, startOfMonth, subDays, toDate } from 'date-fns';
import ls from 'localstorage-slim';
import { Subscription, tap } from 'rxjs';
import { InExcelExportService } from '../in-excel-export.service';

@Component({
    selector: 'in-empty-calendar-header',
    template: '',
    styles: [':host { margin-top: 10px; display: block; }'],
})
export class InEmptyCalendarHeader {}

export interface InExcelReportCardModel {
    client: string;
    project: string;
    isInternal: boolean;
    FormGroup?: FormGroup;
    selectedDays: string[];
}
@Component({
    selector: 'in-excel-report-card',
    templateUrl: './in-excel-report-card.component.html',
    styleUrls: ['./in-excel-report-card.component.scss'],
})
export class InExcelReportCardComponent implements OnChanges, AfterViewInit {
    readonly dateFormat = this.inExcelExportService.dateFormat;
    readonly reportColumns = this.inExcelExportService.reportColumns;
    readonly emptyCalendarHeader = InEmptyCalendarHeader;

    formGroup = new FormGroup({
        client: new FormControl(ls.get('client') || '', [Validators.required]),
        project: new FormControl(ls.get('project') || '', [Validators.required]),
        isInternal: new FormControl(false),
    });

    updateLs$ = this.formGroup.valueChanges.pipe(
        tap(reportConfig => {
            Object.entries(reportConfig).forEach(([key, value]) => {
                ls.set(key, value);
            });
        })
    );

    subscription = new Subscription();

    daysSelected: Set<string> = new Set();

    @ViewChild('calendar') calendar!: MatCalendar<Date>;

    @Input() month?: Date | number;

    @Output() valueChange = new EventEmitter<Set<string>>();

    @Output() remove = new EventEmitter<void>();

    constructor(protected inExcelExportService: InExcelExportService) {
        this.subscription.add(this.updateLs$.subscribe());
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

    ngOnChanges({ month }: SimpleChanges): void {
        if (month) {
            this.daysSelected = new Set(this.getWorkingDayList(month.currentValue));
            this.valueChange.emit(this.daysSelected);
            if (this.calendar) {
                this.calendar.activeDate = toDate(month.currentValue);
                this.calendar.updateTodaysDate();
            }
        }
    }

    ngAfterViewInit() {
        if (!this.month) {
            return;
        }
        this.calendar.activeDate = toDate(this.month);
        this.calendar.updateTodaysDate();
    }

    getWorkingDayList(month: Date | number): string[] {
        const start = startOfMonth(month);
        const end = lastDayOfMonth(month);
        return eachDayOfInterval({ start, end })
            .filter(date => !isWeekend(date))
            .map(date => format(date, this.dateFormat));
    }

    select(event: Date) {
        const date = format(event, this.dateFormat);
        if (this.daysSelected.has(date)) {
            this.daysSelected.delete(date);
        } else {
            this.daysSelected.add(date);
        }
        this.calendar.updateTodaysDate();
        this.valueChange.emit(this.daysSelected);
    }
}
