import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InExcelExportService } from '../in-excel-export.service';

import { InExcelToolbarComponent } from './in-excel-toolbar.component';

describe('InExcelToolbarComponent', () => {
  let component: InExcelToolbarComponent;
  let fixture: ComponentFixture<InExcelToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InExcelToolbarComponent],
      providers: [InExcelExportService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InExcelToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
