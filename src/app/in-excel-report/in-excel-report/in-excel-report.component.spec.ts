import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InExcelExportService } from '../in-excel-export.service';

import { InExcelReportComponent } from './in-excel-report.component';

describe('InExcelReportComponent', () => {
  let component: InExcelReportComponent;
  let fixture: ComponentFixture<InExcelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InExcelReportComponent],
      providers: [InExcelExportService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InExcelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with onne card', () => {
    expect(component).toBeTruthy();
    expect(component.cards.length).toEqual(1);
  });

  it('should add cards', () => {
    component.onAdd();
    expect(component.cards.length).toEqual(2);
  })

  it('should remove cards', () => {
    component.onRemove(0);
    expect(component.cards.length).toEqual(0);
  })
});
