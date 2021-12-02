import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InExcelReportComponent } from './in-excel-report.component';

describe('InExcelReportComponent', () => {
  let component: InExcelReportComponent;
  let fixture: ComponentFixture<InExcelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InExcelReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InExcelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
