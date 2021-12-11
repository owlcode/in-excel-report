import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InExcelExportService } from '../in-excel-export.service';
import { InExcelReportCardComponent } from './in-excel-report-card.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import pl from 'date-fns/locale/pl';
describe('InExcelReportCardComponent', () => {
  let component: InExcelReportCardComponent;
  let fixture: ComponentFixture<InExcelReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InExcelReportCardComponent],
      imports: [MatDateFnsModule, MatDatepickerModule],
      providers: [
        InExcelExportService,
        { provide: MAT_DATE_LOCALE, useValue: pl },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InExcelReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set selected days when month is not set', () => {
    expect(component.daysSelected.size).toEqual(0);
  });

  it('should set selected days when month is set', () => {
    component.month = 1639197591325;
    component.ngOnChanges({ month: { currentValue: component.month } } as any);
    expect(component.daysSelected.size).toEqual(23);
  });
});
