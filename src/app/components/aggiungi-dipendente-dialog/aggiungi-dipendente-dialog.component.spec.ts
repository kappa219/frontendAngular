import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiDipendenteDialogComponent } from './aggiungi-dipendente-dialog.component';

describe('AggiungiDipendenteDialogComponent', () => {
  let component: AggiungiDipendenteDialogComponent;
  let fixture: ComponentFixture<AggiungiDipendenteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggiungiDipendenteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggiungiDipendenteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
