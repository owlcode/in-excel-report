import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InExcelReportCardComponent } from './in-excel-report-card.component';

describe('InExcelReportCardComponent', () => {
  let component: InExcelReportCardComponent;
  let fixture: ComponentFixture<InExcelReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InExcelReportCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InExcelReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
